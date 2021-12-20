import React, { useState, useRef, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/system';
import { ConversationHeaderChannel } from './ConversationHeader/ConversationHeaderChannel.jsx';
import { ConversationHeaderDrMsg } from './ConversationHeader/ConversationHeaderDrMsg.jsx';
import { Messages } from './Messages/Messages';
import { InputUpdateMessages } from './InputUpdateMessages/InputUpdateMessages';
import { ConversationInputHeader } from './ConversationInputHeader/ConversationInputHeader';
import { ConversationActionsMessage } from './ConversationActionsMessage/ConversationActionsMessage.jsx';
import imageError from '../../images/error.png';
import { useQuery, useReactiveVar } from '@apollo/client';
import { CHANNELS } from '../SetsUser/SetsUserGraphQL/queryes';
import { activeChatId, reactiveVarId } from '../../GraphQLApp/reactiveVars';

interface IBadge {
  id: string;
  num: number;
}

interface IProps {
  isErrorInPopap: boolean;
  setIsErrorInPopap: React.Dispatch<React.SetStateAction<boolean>>;
  modalAddPeopleIsOpen: boolean;
  setModalAddPeopleIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dataForBadgeInformNewMsg: IBadge[] | [];
  setChatsHasNewMsgs: React.Dispatch<React.SetStateAction<IBadge[]>>;
}

interface IChannel {
  id: string;
  name: string;
  admin: string;
  description: string;
  members: string[];
  isPrivate: boolean;
}

interface IMessage {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  replyOn: string;
  chatType: string;
  chatId: string;
}

type IChangeMessageRef = null | IMessage;

export default function Conversation(props: IProps) {
  const {
    isErrorInPopap,
    setIsErrorInPopap,
    modalAddPeopleIsOpen,
    setModalAddPeopleIsOpen,
    dataForBadgeInformNewMsg,
    setChatsHasNewMsgs,
  } = props;
  const theme = useTheme();
  const { data: dChannels } = useQuery(CHANNELS);
  const [popupMessage, setPopupMessage] = useState<null | IMessage>(null);
  const [closeBtnChangeMsg, setCloseBtnChangeMsg] = useState(false);
  const [closeBtnReplyMsg, setCloseBtnReplyMsg] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const changeMessageRef = useRef<IChangeMessageRef>(null);
  const activeChannelId = useReactiveVar(activeChatId).activeChannelId;
  const activeDirectMessageId =
    useReactiveVar(activeChatId).activeDirectMessageId;
  const userId = useReactiveVar(reactiveVarId);
  const [openPopup, setOpenPopup] = useState('');

  const checkPrivate = useCallback(() => {
    if (dChannels?.userChannels?.length && activeChannelId) {
      const activeChannelIsPrivate = dChannels.userChannels.find(
        (channel: IChannel) =>
          channel !== null &&
          channel.id === activeChannelId &&
          channel.isPrivate
      );
      return activeChannelIsPrivate
        ? activeChannelIsPrivate.members.includes(userId)
        : true;
    }
    return true;
  }, [dChannels, activeChannelId, userId]);

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
          dataForBadgeInformNewMsg={dataForBadgeInformNewMsg}
          setChatsHasNewMsgs={setChatsHasNewMsgs}
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
          height: closeBtnReplyMsg || closeBtnChangeMsg ? 360 : 385,
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
      <Box style={{ display: openPopup ? 'none' : 'block' }}>
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
