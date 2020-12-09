import React, { useCallback, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connect } from 'react-redux';
import { PROCESSED_NEW_MESSAGE, UPDATE_MESSAGES } from '../../../redux/types';
import {
  getMessages,
  getMessagesForDirectMsg,
} from '../../../redux/actions/actions.js';
import Message from './Message/Message.jsx';
import MessageActionsPopup from './MessageActionsPopup/MessageActionsPopup.jsx';
import './messages.sass';

export function Messages(props) {
  const { activeMessage, setActiveMessage, inputRef, socket } = props;
  const dispatch = useDispatch();
  const reduxMessages = useSelector((state) => state.messages);
  const activeChannelId = useSelector((state) => state.activeChannelId);
  const activeDirectMessageId = useSelector(
    (state) => state.activeDirectMessageId
  );
  const token = useSelector((state) => state.token);
  const userId = useSelector((state) => state.userData._id);
  const newMessage = useSelector((state) => state.newMessage);

  //Підписуємось на подію що спрацює при отриманні повідомлення
  socket.onmessage = (response) => {
    if (response.data === "З'єднання з WebSocket встановлено") {
    } else {
      const parsedRes = JSON.parse(response.data);
      //console.log(reduxMessages);
      const dispatchMessages =
        reduxMessages[0] === undefined
          ? [parsedRes]
          : reduxMessages[0]._id !== parsedRes._id
          ? reduxMessages.reverse().concat(parsedRes)
          : null;
      if (parsedRes._id && dispatchMessages) {
        dispatch({
          type: UPDATE_MESSAGES,
          payload: dispatchMessages,
        });
      }
    }
  };

  //Підписуємось на закриття події
  socket.onclose = (response) => {
    const disconnectStatus = response.wasClean
      ? 'DISCONNECTED CLEAN'
      : 'DISCONNECTED BROKEN';
    console.log(
      `${disconnectStatus} with code ${response.code} reason ${response.reason}`
    );
  };

  useEffect(() => {
    async function getFetchMessages() {
      if (activeChannelId) {
        dispatch(getMessages(token, activeChannelId, { userId }));
      } else if (activeDirectMessageId) {
        dispatch(getMessagesForDirectMsg(token, activeDirectMessageId));
      }
    }

    if ((activeChannelId || activeDirectMessageId) && activeChannelId !== '1') {
      getFetchMessages();
    }
  }, [activeChannelId, activeDirectMessageId]);

  useEffect(() => {
    const activeChatId = activeChannelId
      ? activeChannelId
      : activeDirectMessageId
      ? activeDirectMessageId
      : null;
    if (newMessage && activeChatId) {
      console.log('socket.send => ', activeChatId, newMessage);
      socket.send(JSON.stringify({ room: activeChatId, message: newMessage }));
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
            activeMessage={activeMessage}
            setActiveMessage={setActiveMessage}
          />
        );
      });
    }
  }, [reduxMessages, activeMessage]);

  return (
    <div className='messages'>
      {renderMessages()}
      <MessageActionsPopup
        activeMessage={activeMessage}
        setActiveMessage={setActiveMessage}
        inputRef={inputRef}
      />
    </div>
  );
}

const mapDispatchToProps = {
  getMessages,
  getMessagesForDirectMsg,
};

export default connect(null, mapDispatchToProps)(Messages);
