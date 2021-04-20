import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import { useQuery } from '@apollo/client';
import { wsSingleton } from '../../../WebSocket/soket';
import Message from './Message/Message.jsx';
import MessageActionsPopup from './MessageActionsPopup/MessageActionsPopup.jsx';
import { GET_MESSAGES } from '../../GraphQL/queryes';
import './messages.sass';

export const Messages = React.memo((props) => {
  const {
    inputRef,
    changeMessageRef,
    popupMessage,
    setPopupMessage,
    setCloseBtnChangeMsg,
    setCloseBtnReplyMsg,
  } = props;

  const messagesRef = useRef();
  const { loading, error, data: reduxMessages, refetch } = useQuery(
    GET_MESSAGES,
    {
      onCompleted(data) {
        //console.log('mesages', data);
      },
    }
  );

  useLayoutEffect(() => {
    if (reduxMessages) {
      messagesRef.current = reduxMessages.messages;
    }
  }, [reduxMessages]);

  useEffect(() => {
    if (reduxMessages) {
      renderMessages();
    }
  }, [reduxMessages]);

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

  if (loading) {
    return;
  }

  const renderMessages = () => {
    //console.log(reduxMessages);
    if (reduxMessages && reduxMessages.messages[0]) {
      const messages = reduxMessages.messages.slice(
        0,
        reduxMessages.messages.length
      );
      const reversedMsg = messages.reverse();
      return reversedMsg.map((message) => {
        return (
          <Message
            key={message._id || message.id}
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
