import React, { useState, useRef, useCallback } from 'react';
import { wsSend } from '../../WebSocket/soket';
import { ConversationHeader } from './ConversationHeader/ConversationHeader.jsx';
import { Messages } from './Messages/Messages.jsx';
import { InputUpdateMessages } from './InputUpdateMessages/InputUpdateMessages.jsx';
import EndActionButton from './EndActionButton/EndActionButton.jsx';
import imageError from '../../images/error.png';
import './conversation.sass';
import { useQuery, useReactiveVar } from '@apollo/client';
import { AUTH } from '../../GraphQLApp/queryes';
import { reactiveActiveChannelId } from '../../GraphQLApp/reactiveVariables';

export default function Conversation(props) {
  const { resSuspense } = props;
  const { data: auth } = useQuery(AUTH);
  const [popupMessage, setPopupMessage] = useState(null);
  const [closeBtnChangeMsg, setCloseBtnChangeMsg] = useState(null);
  const [closeBtnReplyMsg, setCloseBtnReplyMsg] = useState(null);
  const inputRef = useRef();
  const changeMessageRef = useRef();
  const activeChannelId = useReactiveVar(reactiveActiveChannelId);

  const checkPrivate = useCallback(() => {
    let isOpenChat = true;
    if (auth && auth.channels && auth.channels[0] && activeChannelId) {
      auth.channels.forEach((channel) => {
        if (channel.id === activeChannelId) {
          if (!channel.isPrivate) {
            return (isOpenChat = true);
          } else if (auth && auth.id && channel.members.includes(auth.id)) {
            return (isOpenChat = true);
          } else return (isOpenChat = false);
        }
      });
    }
    return isOpenChat;
  }, [auth, activeChannelId, auth]);

  const buttonEndActive =
    closeBtnChangeMsg || closeBtnReplyMsg ? (
      <EndActionButton
        closeBtnReplyMsg={closeBtnReplyMsg}
        setCloseBtnReplyMsg={setCloseBtnReplyMsg}
        setCloseBtnChangeMsg={setCloseBtnChangeMsg}
        inputRef={inputRef}
        changeMessageRef={changeMessageRef}
      />
    ) : null;

  const contentMessages = () => {
    const hasNotAccesToChat = checkPrivate();

    return hasNotAccesToChat ? (
      <Messages
        popupMessage={popupMessage}
        setPopupMessage={setPopupMessage}
        setCloseBtnChangeMsg={setCloseBtnChangeMsg}
        setCloseBtnReplyMsg={setCloseBtnReplyMsg}
        inputRef={inputRef}
        changeMessageRef={changeMessageRef}
      />
    ) : (
      <img src={imageError} />
    );
  };

  function registerUnload(msg, onunloadFunc) {
    let alreadPrompted = false,
      timeoutID = 0,
      reset = function () {
        alreadPrompted = false;
        timeoutID = 0;
      };

    if (msg || onunloadFunc) {
      // register
      window.onbeforeunload = function () {
        if (msg && !alreadPrompted) {
          alreadPrompted = true;
          timeoutID = setTimeout(reset, 100);
          return msg;
        }
      };

      window.onunload = function () {
        clearTimeout(timeoutID);
        if (onunloadFunc) onunloadFunc();
      };
    } else {
      // unregister
      window.onbeforeunload = null;
      window.onunload = null;
    }
  }

  registerUnload('Leaving page', function () {
    const storageData = JSON.parse(sessionStorage.getItem('storageData'));
    if (storageData && storageData.channels[0]) {
      const allUserChats = storageData.channels.concat(
        storageData.directMessages
      );
      wsSend({
        userRooms: allUserChats,
        userId: storageData.id,
        meta: 'leave',
        path: 'Conversation',
      });
    }
  });

  const fieldAnswerTo = useCallback(() => {
    if (closeBtnReplyMsg) {
      return (
        <div className='conversation-riply__answer'>{closeBtnReplyMsg}</div>
      );
    }
  }, [closeBtnReplyMsg]);

  return (
    <div className={closeBtnReplyMsg ? 'conversation-riply' : 'conversation'}>
      <ConversationHeader resSuspense={resSuspense} />
      {fieldAnswerTo()}
      {contentMessages()}
      <div className='conversation-input'>
        <InputUpdateMessages
          inputRef={inputRef}
          changeMessageRef={changeMessageRef}
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
