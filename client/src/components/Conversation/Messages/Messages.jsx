import React, {
  useCallback,
  useMemo,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connect } from 'react-redux';
import { PROCESSED_NEW_MESSAGE, UPDATE_MESSAGES } from '../../../redux/types';
import {
  getMessages,
  getMessagesForDirectMsg,
} from '../../../redux/actions/actions.js';
import { wsSingleton, wsSend } from '../../../WebSocket/soket';
import Message from './Message/Message.jsx';
import MessageActionsPopup from './MessageActionsPopup/MessageActionsPopup.jsx';
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
  const dispatch = useDispatch();
  const reduxMessages = useSelector((state) => state.messages);
  const activeChannelId = useSelector((state) => state.activeChannelId);
  const activeDirectMessageId = useSelector(
    (state) => state.activeDirectMessageId
  );
  const token = useSelector((state) => state.token);
  const userId = useSelector((state) => state.userData._id);
  const newMessage = useSelector((state) => state.newMessage);

  const messagesRef = useRef();

  useLayoutEffect(() => {
    messagesRef.current = reduxMessages;
  }, [reduxMessages]);

  console.log('readyMessages');

  //Підписуємось на подію що спрацює при отриманні повідомлення
  wsSingleton.clientPromise
    .then((wsClient) => {
      wsClient.onmessage = (response) => {
        const parsedRes = JSON.parse(response.data);
        console.log(parsedRes);
        if (parsedRes.message === "З'єднання з WebSocket встановлено") {
          return;
        } else if (parsedRes.text) {
          const dispatchMessages =
            messagesRef.current[0] === undefined
              ? [parsedRes]
              : messagesRef.current[0]._id !== parsedRes._id
              ? messagesRef.current.reverse().concat(parsedRes)
              : null;
          if (parsedRes._id && dispatchMessages) {
            dispatch({
              type: UPDATE_MESSAGES,
              payload: dispatchMessages,
            });
          }
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

  useEffect(() => {
    async function getFetchMessages() {
      if (activeChannelId && token && userId) {
        dispatch(getMessages(token, activeChannelId, { userId }));
      } else if (activeDirectMessageId && token) {
        dispatch(getMessagesForDirectMsg(token, activeDirectMessageId));
      }
    }

    if (activeChannelId !== '1') getFetchMessages();
  }, [activeChannelId, activeDirectMessageId]);

  useEffect(() => {
    const activeChatId = activeChannelId
      ? activeChannelId
      : activeDirectMessageId
      ? activeDirectMessageId
      : null;
    if (newMessage && activeChatId) {
      wsSend({ room: activeChatId, message: newMessage });
      dispatch({
        type: PROCESSED_NEW_MESSAGE,
        payload: null,
      });
    }
  }, [newMessage, activeChannelId]);

  const reverseMsg = useMemo(() => {
    if (reduxMessages === '403') {
      return '403';
    } else {
      return reduxMessages.reverse();
    }
  }, [reduxMessages]);

  const renderMessages = useCallback(() => {
    if (reduxMessages !== '403') {
      return reverseMsg.map((message) => {
        return (
          <Message
            key={message._id || message.id}
            message={message}
            setPopupMessage={setPopupMessage}
          />
        );
      });
    }
  }, [reduxMessages]);

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

const mapDispatchToProps = { getMessages, getMessagesForDirectMsg };

export default connect(null, mapDispatchToProps)(Messages);
