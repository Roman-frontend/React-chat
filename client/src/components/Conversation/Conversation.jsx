import React, { useState, useRef, useCallback, useEffect } from 'react';
import { wsSend } from '../../WebSocket/soket';
import { ConversationHeaderChannel } from './ConversationHeader/ConversationHeaderChannel.jsx';
import { ConversationHeaderDrMsg } from './ConversationHeader/ConversationHeaderDrMsg.jsx';
import { Messages } from './Messages/Messages.jsx';
import { InputUpdateMessages } from './InputUpdateMessages/InputUpdateMessages.jsx';
import EndActionButton from './EndActionButton/EndActionButton.jsx';
import imageError from '../../images/error.png';
import './conversation.sass';
import { useQuery, useReactiveVar } from '@apollo/client';
import { CHANNELS } from '../SetsUser/SetsUserGraphQL/queryes';
import { activeChatId, reactiveVarId } from '../../GraphQLApp/reactiveVars';

export default function Conversation(props) {
  const {
    isOpenRightBarDrMsg,
    setIsOpenRightBarDrMsg,
    isOpenRightBarChannels,
    setIsOpenRightBarChannels,
  } = props;
  const { data: channels } = useQuery(CHANNELS);
  const [popupMessage, setPopupMessage] = useState(null);
  const [closeBtnChangeMsg, setCloseBtnChangeMsg] = useState(null);
  const [closeBtnReplyMsg, setCloseBtnReplyMsg] = useState(null);
  const inputRef = useRef();
  const changeMessageRef = useRef();
  const activeChannelId = useReactiveVar(activeChatId).activeChannelId;
  const activeDirectMessageId =
    useReactiveVar(activeChatId).activeDirectMessageId;
  const userId = useReactiveVar(reactiveVarId);

  useEffect(() => {
    if (inputRef.current && inputRef.current.children[1].children[0]) {
      inputRef.current.children[1].children[0].focus();
    }
  }, [inputRef, activeChannelId, activeDirectMessageId]);

  const checkPrivate = useCallback(() => {
    if (
      channels &&
      Array.isArray(channels.userChannels) &&
      channels.userChannels[0] &&
      activeChannelId
    ) {
      const activeChannelIsPrivate = channels.userChannels.find(
        (channel) =>
          channel !== null &&
          channel.id === activeChannelId &&
          channel.isPrivate
      );
      return activeChannelIsPrivate
        ? activeChannelIsPrivate.members.includes(userId)
        : true;
    }
    return true;
  }, [channels, activeChannelId, userId]);

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

    if (!hasNotAccesToChat) {
      return <img src={imageError} />;
    }
    if (activeChannelId || activeDirectMessageId) {
      return (
        <Messages
          popupMessage={popupMessage}
          setPopupMessage={setPopupMessage}
          setCloseBtnChangeMsg={setCloseBtnChangeMsg}
          setCloseBtnReplyMsg={setCloseBtnReplyMsg}
          inputRef={inputRef}
          changeMessageRef={changeMessageRef}
        />
      );
    }
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
      {activeChannelId ? (
        <ConversationHeaderChannel
          isOpenRightBarChannels={isOpenRightBarChannels}
          setIsOpenRightBarChannels={setIsOpenRightBarChannels}
        />
      ) : (
        <ConversationHeaderDrMsg
          isOpenRightBarDrMsg={isOpenRightBarDrMsg}
          setIsOpenRightBarDrMsg={setIsOpenRightBarDrMsg}
        />
      )}
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
