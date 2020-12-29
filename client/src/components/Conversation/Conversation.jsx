//Тут розфасовка між activeChannelId і activeDirectMessageId зроблено
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { ConversationHeader } from './ConversationHeader/ConversationHeader.jsx';
import { Messages } from './Messages/Messages.jsx';
import { InputUpdateMessages } from './InputUpdateMessages/InputUpdateMessages.jsx';
import EndActionButton from './EndActionButton/EndActionButton.jsx';
import imageError from '../../images/error.png';
import './conversation.sass';
import { useCallback } from 'react';

export default function Conversation(props) {
  const { socket, sendMessage } = props;
  const userId = useSelector((state) => state.userData._id);
  const channels = useSelector((state) => state.channels);
  const activeChannelId = useSelector((state) => state.activeChannelId);
  const activeDirectMessageId = useSelector(
    (state) => state.activeDirectMessageId
  );
  const [activeMessage, setActiveMessage] = useState(null);
  const [popupMessage, setPopupMessage] = useState(null);
  const [closeBtnChangeMsg, setCloseBtnChangeMsg] = useState(null);
  const [closeBtnReplyMsg, setCloseBtnReplyMsg] = useState(null);
  const [isJoin, setIsJoin] = useState(false);
  const inputRef = useRef();

  useLayoutEffect(() => {
    setActiveMessage(null);
  }, [activeChannelId, activeDirectMessageId]);

  useLayoutEffect(() => {
    //Підписуємось на подію, так відкриваємо з'єднання
    socket.onopen = () => {
      console.log('ONLINE');
    };
  }, []);

  useEffect(() => {
    const storageData = JSON.parse(localStorage.getItem('userData'));
    if (!storageData) setIsJoin(false);
    if (storageData.userData.channels[0] && !isJoin) {
      setIsJoin(true);
      const allUserChats = storageData.userData.channels.concat(
        storageData.userData.directMessages
      );
      sendMessage(
        socket,
        JSON.stringify({
          userRooms: allUserChats,
          meta: 'join',
          userId: storageData.userData._id,
        })
      );
    }
  }, [channels]);
  /*   useEffect(() => {
    if ((activeChannelId || activeDirectMessageId) && channels[0] && userId) {
      const activeChatId = activeChannelId
        ? activeChannelId
        : activeDirectMessageId;
      console.log(activeChannelId, activeDirectMessageId, channels);
      sendMessage(
        socket,
        JSON.stringify({ room: activeChatId, meta: 'join', userId })
      );
    }
  }, [channels]); */

  const checkPrivate = useCallback(() => {
    let isOpenChat = true;
    if (channels && channels[0] && activeChannelId) {
      channels.forEach((channel) => {
        if (channel._id === activeChannelId) {
          if (!channel.isPrivate) {
            return (isOpenChat = true);
          } else if (channel.members.includes(userId)) {
            return (isOpenChat = true);
          } else return (isOpenChat = false);
        }
      });
    }
    return isOpenChat;
  }, [channels, activeChannelId, userId]);

  const buttonEndActive =
    closeBtnChangeMsg || closeBtnReplyMsg ? (
      <EndActionButton
        closeBtnReplyMsg={closeBtnReplyMsg}
        setCloseBtnReplyMsg={setCloseBtnReplyMsg}
        setCloseBtnChangeMsg={setCloseBtnChangeMsg}
        inputRef={inputRef}
      />
    ) : null;

  const contentMessages = () => {
    const hasNotAccesToChat = checkPrivate();

    return hasNotAccesToChat ? (
      <Messages
        activeMessage={activeMessage}
        setActiveMessage={setActiveMessage}
        popupMessage={popupMessage}
        setPopupMessage={setPopupMessage}
        setCloseBtnChangeMsg={setCloseBtnChangeMsg}
        setCloseBtnReplyMsg={setCloseBtnReplyMsg}
        inputRef={inputRef}
        socket={socket}
      />
    ) : (
      <img src={imageError} />
    );
  };

  const fieldAnswerTo = useCallback(() => {
    if (closeBtnReplyMsg) {
      return (
        <div className='conversation-riply__answer'>{closeBtnReplyMsg}</div>
      );
    }
  }, [closeBtnReplyMsg]);

  return (
    <div className={closeBtnReplyMsg ? 'conversation-riply' : 'conversation'}>
      <ConversationHeader />
      {fieldAnswerTo()}
      {contentMessages()}
      <div className='conversation-input'>
        <InputUpdateMessages
          inputRef={inputRef}
          closeBtnChangeMsg={closeBtnChangeMsg}
          setCloseBtnChangeMsg={setCloseBtnChangeMsg}
          closeBtnReplyMsg={closeBtnReplyMsg}
          setCloseBtnReplyMsg={setCloseBtnReplyMsg}
        />
        {buttonEndActive}
      </div>
    </div>
  );
}
