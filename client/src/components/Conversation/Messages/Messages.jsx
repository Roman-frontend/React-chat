import React, { useState, useMemo, Profiler, memo, useCallback } from 'react';
import { useQuery, useReactiveVar } from '@apollo/client';
import { wsSingleton } from '../../../WebSocket/soket';
import Message from './Message/Message.jsx';
import { GET_MESSAGES } from '../ConversationGraphQL/queryes';
import { GET_DIRECT_MESSAGES } from '../../SetsUser/SetsUserGraphQL/queryes';
import {
  reactiveVarId,
  activeChatId,
  reactiveDirectMessages,
  reactiveVarChannels,
} from '../../../GraphQLApp/reactiveVars';
import { Loader } from '../../Helpers/Loader';

export const Messages = memo((props) => {
  const {
    openPopup,
    setOpenPopup,
    dataForBadgeInformNewMsg,
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
      ? 'DirectMessage'
      : activeChannelId
      ? 'Channel'
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
    variables: { chatId, chatType, userId },
    onCompleted(data) {
      if (data && data.messages) {
        renderMessages();
      }
    },
    onError(data) {
      console.log('error __', data);
    },
  });

  //Підписуємось на подію що спрацює при отриманні повідомлення
  wsSingleton.clientPromise
    .then((wsClient) => {
      wsClient.onmessage = (response) => {
        const parsedRes = JSON.parse(response.data);
        console.log(parsedRes);
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
          console.log(isFirstNewMsgInChat);
          const num = isFirstNewMsgInChat ? isFirstNewMsgInChat.num + 1 : 1;
          const newChatHasNewMsgs = { id: parsedRes.chatId, num };
          const filteredChats = dataForBadgeInformNewMsg.filter(
            (chat) => chat.id !== parsedRes.chatId
          );
          setChatsHasNewMsgs((prev) => [...filteredChats, newChatHasNewMsgs]);
        }

        if (parsedRes?.message && parsedRes.message === 'added dm') {
          const storage = JSON.parse(sessionStorage.getItem('storageData'));
          const toStorage = JSON.stringify({
            ...storage,
            directMessages: [...storage.directMessages, parsedRes.id],
          });
          sessionStorage.setItem('storageData', toStorage);
          reactiveDirectMessages([...userDmIds, parsedRes.id]);
          refetch();
        }
        if (parsedRes?.message && parsedRes.message === 'removed dm') {
          const storage = JSON.parse(sessionStorage.getItem('storageData'));
          const newDrMsgIds = storage.directMessages.filter(
            (dmId) => dmId !== parsedRes.id
          );
          const toStorage = JSON.stringify({
            ...storage,
            directMessages: newDrMsgIds,
          });
          sessionStorage.setItem('storageData', toStorage);
          reactiveDirectMessages(newDrMsgIds);
          refetch();
        }
      };
    })
    .catch((error) => console.log(error));

  //Підписуємось на закриття події
  wsSingleton.onclose = (response) => {
    const disconnectStatus = response.wasClean
      ? 'DISCONNECTED CLEAN'
      : 'DISCONNECTED BROKEN';
    console.log(
      `${disconnectStatus} with code ${response.code} reason ${response.reason}`
    );
  };

  const callback = (id, phase, actualTime, baseTime, startTime, commitTime) => {
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
      return reversedMessages.map((message) => {
        return (
          <Profiler id='Message' key={message.id} onRender={callback}>
            <Message
              key={message.id}
              message={message}
              openPopup={openPopup}
              setOpenPopup={setOpenPopup}
              {...props}
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
