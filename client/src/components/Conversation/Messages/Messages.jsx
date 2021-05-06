import React, { useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import { useQuery, useReactiveVar } from '@apollo/client';
import { wsSingleton } from '../../../WebSocket/soket';
import Message from './Message/Message.jsx';
import MessageActionsPopup from './MessageActionsPopup/MessageActionsPopup.jsx';
import { GET_MESSAGES } from '../ConversationGraphQL/queryes';
import './messages.sass';
import {
  reactiveVarId,
  activeChatId,
} from '../../../GraphQLApp/reactiveVariables';

export const Messages = React.memo((props) => {
  const {
    inputRef,
    changeMessageRef,
    popupMessage,
    setPopupMessage,
    setCloseBtnChangeMsg,
    setCloseBtnReplyMsg,
  } = props;
  const userId = useReactiveVar(reactiveVarId);
  const activeChannelId = useReactiveVar(activeChatId).activeChannelId;
  const activeDirectMessageId = useReactiveVar(activeChatId)
    .activeDirectMessageId;
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

  console.log({ chatId, chatType, userId });
  const { data: messages, client } = useQuery(GET_MESSAGES, {
    variables: { chatId, chatType, userId },
    onCompleted(data) {
      console.log('mesages', data);
    },
  });

  console.log('activeChatId', activeChannelId || activeDirectMessageId);

  useEffect(() => {
    renderMessages();
  }, [messages]);

  //Підписуємось на подію що спрацює при отриманні повідомлення
  wsSingleton.clientPromise
    .then((wsClient) => {
      wsClient.onmessage = (response) => {
        const parsedRes = JSON.parse(response.data);
        if (parsedRes && parsedRes.text) {
          console.log('refetch()', parsedRes);
          const oldMsg = client.readQuery({
            query: GET_MESSAGES,
            variables: { chatId, chatType },
          });
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

  const renderMessages = () => {
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
          <Message
            key={message.id}
            message={message}
            setPopupMessage={setPopupMessage}
          />
        );
      });
    }
  };

  return (
    <div className='messages'>
      {renderMessages()}
      <MessageActionsPopup
        popupMessage={popupMessage}
        setPopupMessage={setPopupMessage}
        setCloseBtnChangeMsg={setCloseBtnChangeMsg}
        setCloseBtnReplyMsg={setCloseBtnReplyMsg}
        inputRef={inputRef}
        changeMessageRef={changeMessageRef}
      />
    </div>
  );
});
