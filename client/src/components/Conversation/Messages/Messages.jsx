import React, { useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import { useQuery, useReactiveVar } from '@apollo/client';
import { wsSingleton } from '../../../WebSocket/soket';
import Message from './Message/Message.jsx';
import MessageActionsPopup from './MessageActionsPopup/MessageActionsPopup.jsx';
import { GET_MESSAGES } from '../../GraphQL/queryes';
import './messages.sass';
import {
  reactiveActiveChannelId,
  reactiveActiveDirrectMessageId,
} from '../../GraphQL/reactiveVariables';

export const Messages = React.memo((props) => {
  const {
    inputRef,
    changeMessageRef,
    popupMessage,
    setPopupMessage,
    setCloseBtnChangeMsg,
    setCloseBtnReplyMsg,
  } = props;
  const activeChannelId = useReactiveVar(reactiveActiveChannelId);
  const activeDirectMessageId = useReactiveVar(reactiveActiveDirrectMessageId);
  const chatType = useMemo(() => {
    return activeDirectMessageId
      ? 'DirectMessage'
      : activeChannelId
      ? 'Channel'
      : null;
  }, [activeChannelId, activeDirectMessageId]);

  const chatId = useMemo(() => {
    return activeDirectMessageId
      ? activeDirectMessageId
      : activeChannelId
      ? activeChannelId
      : null;
  }, [activeChannelId, activeDirectMessageId]);

  const { loading, data: messages, client, refetch } = useQuery(GET_MESSAGES, {
    variables: { chatId, chatType },
    onCompleted(data) {
      console.log('mesages', data);
    },
  });

  useEffect(() => {
    if (messages) {
      renderMessages();
    }
  }, [messages]);

  //Підписуємось на подію що спрацює при отриманні повідомлення
  wsSingleton.clientPromise
    .then((wsClient) => {
      wsClient.onmessage = (response) => {
        const parsedRes = JSON.parse(response.data);
        if (parsedRes && parsedRes.text) {
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

  const renderMessages = () => {
    console.log(messages);
    if (
      messages &&
      messages.messages &&
      Array.isArray(messages.messages.chatMessages)
    ) {
      const slicedMessages = messages.messages.chatMessages.slice(
        0,
        messages.messages.chatMessages.length
      );
      const reversedMsg = slicedMessages.reverse();
      return reversedMsg.map((message) => {
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
