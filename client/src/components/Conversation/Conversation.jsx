import React, { useState, useRef, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/system';
import { ConversationHeaderChannel } from './ConversationHeader/ConversationHeaderChannel.jsx';
import { ConversationHeaderDrMsg } from './ConversationHeader/ConversationHeaderDrMsg.jsx';
import { Messages } from './Messages/Messages.jsx';
import { InputUpdateMessages } from './InputUpdateMessages/InputUpdateMessages.jsx';
import { ConversationInputHeader } from './ConversationInputHeader/ConversationInputHeader.jsx';
import { ConversationActionsMessage } from './ConversationActionsMessage/ConversationActionsMessage.jsx';
import imageError from '../../images/error.png';
import { useQuery, useReactiveVar } from '@apollo/client';
import { CHANNELS } from '../SetsUser/SetsUserGraphQL/queryes';
import { activeChatId, reactiveVarId } from '../../GraphQLApp/reactiveVars';

export default function Conversation(props) {
  const {
    isErrorInPopap,
    setIsErrorInPopap,
    modalAddPeopleIsOpen,
    setModalAddPeopleIsOpen,
  } = props;
  const theme = useTheme();
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
  const [openPopup, setOpenPopup] = useState(false);

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

  const contentMessages = () => {
    const hasNotAccesToChat = checkPrivate();

    if (!hasNotAccesToChat) {
      return <img src={imageError} />;
    }
    if (activeChannelId || activeDirectMessageId) {
      return (
        <Messages
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
          popupMessage={popupMessage}
          setPopupMessage={setPopupMessage}
          setCloseBtnChangeMsg={setCloseBtnChangeMsg}
          setCloseBtnReplyMsg={setCloseBtnReplyMsg}
          inputRef={inputRef}
          changeMessageRef={changeMessageRef}
        />
      );
    }
    return null;
  };

  function inputHeader() {
    if ((closeBtnReplyMsg || closeBtnChangeMsg) && popupMessage) {
      return (
        <ConversationInputHeader
          popupMessage={popupMessage}
          closeBtnReplyMsg={closeBtnReplyMsg}
          setCloseBtnReplyMsg={setCloseBtnReplyMsg}
          setCloseBtnChangeMsg={setCloseBtnChangeMsg}
          inputRef={inputRef}
          changeMessageRef={changeMessageRef}
        />
      );
    }
    return null;
  }

  const setHeader = useCallback(() => {
    return activeChannelId ? (
      <ConversationHeaderChannel
        modalAddPeopleIsOpen={modalAddPeopleIsOpen}
        setModalAddPeopleIsOpen={setModalAddPeopleIsOpen}
        isErrorInPopap={isErrorInPopap}
        setIsErrorInPopap={setIsErrorInPopap}
      />
    ) : (
      <ConversationHeaderDrMsg />
    );
  }, [activeChannelId, activeDirectMessageId, modalAddPeopleIsOpen]);

  return (
    <Box>
      {setHeader()}
      <Box
        style={{
          overflowY: 'auto',
          flexDirection: 'column-reverse',
          display: 'flex',
          height: closeBtnReplyMsg || closeBtnChangeMsg ? '57vh' : '61vh',
        }}
      >
        {contentMessages()}
      </Box>
      {inputHeader()}
      <ConversationActionsMessage
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        setCloseBtnReplyMsg={setCloseBtnReplyMsg}
        inputRef={inputRef}
        setCloseBtnChangeMsg={setCloseBtnChangeMsg}
        changeMessageRef={changeMessageRef}
        popupMessage={popupMessage}
      />
      <Box style={{ display: openPopup && 'none' }}>
        <InputUpdateMessages
          popupMessage={popupMessage}
          inputRef={inputRef}
          changeMessageRef={changeMessageRef}
          closeBtnChangeMsg={closeBtnChangeMsg}
          setCloseBtnChangeMsg={setCloseBtnChangeMsg}
          closeBtnReplyMsg={closeBtnReplyMsg}
          setCloseBtnReplyMsg={setCloseBtnReplyMsg}
        />
      </Box>
    </Box>
  );
}
