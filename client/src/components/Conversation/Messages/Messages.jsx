import React, {
  useCallback,
  useMemo,
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connect } from 'react-redux';
import {
  PROCESSED_NEW_MESSAGE,
  UPDATE_MESSAGES,
  GET_USERS_ONLINE,
} from '../../../redux/types';
import {
  getMessages,
  getMessagesForDirectMsg,
} from '../../../redux/actions/actions.js';
import Message from './Message/Message.jsx';
import MessageActionsPopup from './MessageActionsPopup/MessageActionsPopup.jsx';
import './messages.sass';

export const Messages = React.memo((props) => {
  const {
    activeMessage,
    setActiveMessage,
    inputRef,
    socket,
    popupMessage,
    setPopupMessage,
    setCloseBtnChangeMsg,
    setCloseBtnReplyMsg,
  } = props;
  const dispatch = useDispatch();
  const reduxMessages = useSelector((state) => state.messages);
  const chatsOnline = useSelector((state) => state.usersOnline);
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

  //Підписуємось на подію що спрацює при отриманні повідомлення
  socket.clientPromise
    .then((wsClient) => {
      wsClient.onmessage = (response) => {
        if (response.data === "З'єднання з WebSocket встановлено") {
          console.log("З'єднання з WebSocket встановлено");
          return;
        }

        const parsedRes = JSON.parse(response.data);
        if (parsedRes.message === 'resOnlineMembers') {
          let updatedOnline = chatsOnline;
          if (!updatedOnline[0]) {
            updatedOnline = updatedOnline.concat(parsedRes.data);
          } else {
            let indexResChatInOnline = null;
            chatsOnline.forEach((chat, index) => {
              if (chat.chatId === parsedRes.data.chatId) {
                indexResChatInOnline = index;
              }
            });
            if (indexResChatInOnline === null) {
              updatedOnline = updatedOnline.concat(parsedRes.data);
            } else if (
              indexResChatInOnline !== null &&
              JSON.stringify(updatedOnline[indexResChatInOnline]) !==
                JSON.stringify(parsedRes.data)
            ) {
              console.log(updatedOnline[indexResChatInOnline], parsedRes.data);
              updatedOnline.splice(indexResChatInOnline, 1, parsedRes.data);
            }
          }
          dispatch({
            type: GET_USERS_ONLINE,
            payload: updatedOnline,
          });
        } else {
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
      socket.clientPromise
        .then((wsClient) => {
          wsClient.send(
            JSON.stringify({ room: activeChatId, message: newMessage })
          );
        })
        .catch((error) => console.log(error));
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
            setActiveMessage={setActiveMessage}
            setPopupMessage={setPopupMessage}
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
        popupMessage={popupMessage}
        setPopupMessage={setPopupMessage}
        setCloseBtnChangeMsg={setCloseBtnChangeMsg}
        setCloseBtnReplyMsg={setCloseBtnReplyMsg}
        inputRef={inputRef}
      />
    </div>
  );
});

const mapDispatchToProps = {
  getMessages,
  getMessagesForDirectMsg,
};

export default connect(null, mapDispatchToProps)(Messages);
