import React, { useMemo, Profiler, memo, useCallback, useContext } from "react";
import { useQuery, useReactiveVar, useApolloClient } from "@apollo/client";
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
import { AppContext } from "../../../Context/AppContext";

type TBadges = IBadge[] | [];

interface IProps {
  openPopup: string;
  setOpenPopup: React.Dispatch<React.SetStateAction<string>>;
  setPopupMessage: React.Dispatch<React.SetStateAction<null | IMessage>>;
  setCloseBtnChangeMsg: React.Dispatch<React.SetStateAction<boolean>>;
  setCloseBtnReplyMsg: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Messages = memo((props: IProps) => {
  const {
    openPopup,
    setOpenPopup,
    setPopupMessage,
    setCloseBtnChangeMsg,
    setCloseBtnReplyMsg,
  } = props;
  const clientApp = useApolloClient();
  const userId = useReactiveVar(reactiveVarId);
  const activeChannelId = useReactiveVar(activeChatId).activeChannelId;
  const activeDirectMessageId =
    useReactiveVar(activeChatId).activeDirectMessageId;
  const userDmIds = useReactiveVar(reactiveDirectMessages);
  const { newMsgsBadge, setNewMsgsBadge } = useContext(AppContext);
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
    // variables: {
    //   chatId: "6288671cb24f6a89e861b98d",
    //   chatType: "DirectMessage",
    //   userId: "6288661c22cf8e8950762e14",
    // },
    variables: {
      chatId,
      chatType,
      userId,
    },
    onError(data) {
      console.log("error __", data);
    },
  });

  const overwriteTheChat = (parsedRes: any) => {
    console.log("overwriteTheChat");
    const oldMsg = client.readQuery({
      query: GET_MESSAGES,
      variables: { chatId, chatType, userId },
    });
    const chatMessages = oldMsg?.messages?.chatMessages || [];
    client.writeQuery({
      query: GET_MESSAGES,
      data: {
        messages: {
          ...oldMsg.messages,
          chatMessages: [...chatMessages, parsedRes],
        },
      },
    });
  };

  const overwriteAChat = (parsedRes: any) => {
    let isFirstNewMsgInChat;
    if (newMsgsBadge[0]) {
      isFirstNewMsgInChat = newMsgsBadge.find(
        (chat) => chat.id === parsedRes.chatId
      );
    }
    console.log(
      "isFirstNewMsgInChat: ",
      isFirstNewMsgInChat,
      "newMsgsBadge: ",
      newMsgsBadge
    );
    const num: number = isFirstNewMsgInChat ? isFirstNewMsgInChat.num + 1 : 1;
    const newChatHasNewMsgs: IBadge = { id: parsedRes.chatId, num };
    const filteredChats: IBadge[] = newMsgsBadge.filter(
      (chat) => chat.id !== parsedRes.chatId
    );
    setNewMsgsBadge((prev: TBadges) => [...filteredChats, newChatHasNewMsgs]);
  };

  const overwriteDMs = async (parsedRes: any) => {
    const sessionStorageUnParse: string | null =
      sessionStorage.getItem("storageData");
    let storage;
    if (sessionStorageUnParse) storage = JSON.parse(sessionStorageUnParse);
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
    await clientApp.query({
      query: GET_DIRECT_MESSAGES,
      variables: { id: [parsedRes.id] },
    });
  };

  //Підписуємось на подію що спрацює при отриманні повідомлення
  wsSingleton.clientPromise
    .then((wsClient: any) => {
      wsClient.onmessage = (response: { data: string }) => {
        const parsedRes = JSON.parse(response.data);
        console.log("socket: ", parsedRes);
        if (parsedRes?.text && parsedRes?.chatId === chatId) {
          overwriteTheChat(parsedRes);
        } else if (parsedRes?.text && parsedRes?.chatId !== chatId) {
          overwriteAChat(parsedRes);
        } else if (
          parsedRes?.message === "added dm" ||
          parsedRes?.message === "removed dm"
        ) {
          overwriteDMs(parsedRes);
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
