import React, { useState, useMemo, Profiler, memo, useCallback } from "react";
import { useQuery, useReactiveVar } from "@apollo/client";
import { wsSingleton } from "../../../WebSocket/soket";
import Message from "./Message/Message";
import { GET_MESSAGES } from "../ConversationGraphQL/queryes";
import { GET_DIRECT_MESSAGES } from "../../SetsUser/SetsUserGraphQL/queryes";
import {
  reactiveVarId,
  activeChatId,
  reactiveDirectMessages,
} from "../../../GraphQLApp/reactiveVars";
import { Loader } from "../../Helpers/Loader";
import IMessage from "../Models/IMessage";
import IBadge from "../../../Models/IBadge";

type TBadges = IBadge[] | [];

interface IProps {
  openPopup: string;
  setOpenPopup: React.Dispatch<React.SetStateAction<string>>;
  setPopupMessage: React.Dispatch<React.SetStateAction<null | IMessage>>;
  setCloseBtnChangeMsg: React.Dispatch<React.SetStateAction<boolean>>;
  setCloseBtnReplyMsg: React.Dispatch<React.SetStateAction<boolean>>;
  dataForBadgeInformNewMsg: TBadges;
  setChatsHasNewMsgs: React.Dispatch<React.SetStateAction<TBadges>>;
}

export const Messages = memo((props: IProps) => {
  const {
    openPopup,
    setOpenPopup,
    dataForBadgeInformNewMsg,
    setPopupMessage,
    setCloseBtnChangeMsg,
    setCloseBtnReplyMsg,
    setChatsHasNewMsgs,
  } = props;
  const userId = useReactiveVar(reactiveVarId);
  const activeChannelId = useReactiveVar(activeChatId).activeChannelId;
  const activeDirectMessageId =
    useReactiveVar(activeChatId).activeDirectMessageId;
  const userDmIds = useReactiveVar(reactiveDirectMessages);
  const { refetch } = useQuery(GET_DIRECT_MESSAGES);
  const chatType = useMemo(() => {
    return activeDirectMessageId
      ? "DirectMessage"
      : activeChannelId
      ? "Channel"
      : null;
  }, [activeChannelId, activeDirectMessageId]);

  const chatId = useMemo(() => {
    return activeDirectMessageId || activeChannelId || null;
  }, [activeChannelId, activeDirectMessageId]);

  const {
    loading,
    data: messages,
    client,
  } = useQuery(GET_MESSAGES, {
    variables: {
      chatId: "6288671cb24f6a89e861b98d",
      chatType: "DirectMessage",
      userId: "6288661c22cf8e8950762e14",
    },
    onCompleted(data) {
      console.log(data);
      if (data && data.messages) {
        renderMessages();
      }
    },
    onError(data) {
      console.log("error __", data);
    },
  });

  //Підписуємось на подію що спрацює при отриманні повідомлення
  wsSingleton.clientPromise
    .then((wsClient: any) => {
      wsClient.onmessage = (response: { data: string }) => {
        const parsedRes = JSON.parse(response.data);
        if (parsedRes && parsedRes.text && parsedRes.chatId === chatId) {
          const oldMsg = client.readQuery({
            query: GET_MESSAGES,
            variables: { chatId, chatType, userId },
          });
          console.log(oldMsg, chatId, chatType, userId);
          const chatMessages =
            oldMsg && oldMsg.messages && oldMsg.messages.chatMessages
              ? oldMsg.messages.chatMessages
              : [];
          client.writeQuery({
            query: GET_MESSAGES,
            data: {
              messages: {
                ...oldMsg.messages,
                chatMessages: [...chatMessages, parsedRes],
              },
            },
          });
        }

        if (parsedRes && parsedRes.text && parsedRes.chatId !== chatId) {
          let isFirstNewMsgInChat;
          if (dataForBadgeInformNewMsg[0]) {
            isFirstNewMsgInChat = dataForBadgeInformNewMsg.find(
              (chat) => chat.id === parsedRes.chatId
            );
          }
          const num: number = isFirstNewMsgInChat
            ? isFirstNewMsgInChat.num + 1
            : 1;
          const newChatHasNewMsgs: IBadge = { id: parsedRes.chatId, num };
          const filteredChats: IBadge[] = dataForBadgeInformNewMsg.filter(
            (chat) => chat.id !== parsedRes.chatId
          );
          setChatsHasNewMsgs((prev: TBadges) => [
            ...filteredChats,
            newChatHasNewMsgs,
          ]);
        }

        if (
          parsedRes?.message &&
          parsedRes.message === ("added dm" || "removed dm")
        ) {
          const sessionStorageUnParse: string | null =
            sessionStorage.getItem("storageData");
          let storage;
          if (sessionStorageUnParse)
            storage = JSON.parse(sessionStorageUnParse);
          let toStorage;
          let newDrMsgIds = [];
          if (parsedRes.message === "added dm" && storage) {
            toStorage = JSON.stringify({
              ...storage,
              directMessages: [...storage.directMessages, parsedRes.id],
            });
            newDrMsgIds = [...userDmIds, parsedRes.id];
          } else if (parsedRes.message === "removed dm" && storage) {
            newDrMsgIds = storage.directMessages.filter(
              (dmId: string) => dmId !== parsedRes.id
            );
            toStorage = JSON.stringify({
              ...storage,
              directMessages: newDrMsgIds,
            });
          }
          if (toStorage) sessionStorage.setItem("storageData", toStorage);
          reactiveDirectMessages(newDrMsgIds);
          refetch();
        }
      };
    })
    .catch((error: string) => console.log(error));

  //Підписуємось на закриття події
  wsSingleton.onclose = (response) => {
    const disconnectStatus = response.wasClean
      ? "DISCONNECTED CLEAN"
      : "DISCONNECTED BROKEN";
    console.log(
      `${disconnectStatus} with code ${response.code} reason ${response.reason}`
    );
  };

  const callback = (
    _id: string,
    _phase: string,
    _actualTime: number,
    _baseTime: number,
    _startTime: number,
    _commitTime: number
  ) => {
    //console.log(`${id}'s ${phase} phase:`);
  };

  const renderMessages = useCallback(() => {
    if (
      messages &&
      messages.messages &&
      Array.isArray(messages.messages.chatMessages)
    ) {
      const reversedMessages = messages.messages.chatMessages
        .slice(0, messages.messages.chatMessages.length)
        .reverse();
      return reversedMessages.map((message: IMessage) => {
        return (
          <Profiler id="Message" key={message.id} onRender={callback}>
            <Message
              key={message.id}
              message={message}
              openPopup={openPopup}
              setOpenPopup={setOpenPopup}
              setPopupMessage={setPopupMessage}
              setCloseBtnChangeMsg={setCloseBtnChangeMsg}
              setCloseBtnReplyMsg={setCloseBtnReplyMsg}
            />
          </Profiler>
        );
      });
    }
    return null;
  }, [messages, openPopup]);

  if (loading) {
    return <Loader />;
  }

  return renderMessages();
});
