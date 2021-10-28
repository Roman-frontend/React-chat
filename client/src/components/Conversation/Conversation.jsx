import React, { useState, useRef, useCallback } from 'react';
import { wsSend } from '../../WebSocket/soket';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import ReplyIcon from '@mui/icons-material/Reply';
import EditIcon from '@mui/icons-material/Edit';
import ForwardIcon from '@mui/icons-material/Forward';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box } from '@mui/system';
import { ConversationHeaderChannel } from './ConversationHeader/ConversationHeaderChannel.jsx';
import { ConversationHeaderDrMsg } from './ConversationHeader/ConversationHeaderDrMsg.jsx';
import { Messages } from './Messages/Messages.jsx';
import { InputUpdateMessages } from './InputUpdateMessages/InputUpdateMessages.jsx';
import EndActionButton from './EndActionButton/EndActionButton.jsx';
import imageError from '../../images/error.png';
import './conversation.sass';
import { useQuery, useMutation, useReactiveVar } from '@apollo/client';
import { CHANNELS } from '../SetsUser/SetsUserGraphQL/queryes';
import { activeChatId, reactiveVarId } from '../../GraphQLApp/reactiveVars';
import { REMOVE_MESSAGE } from './ConversationGraphQL/queryes';

const stylesButton = { margin: 2 /* border: '1px solid rebeccapurple' */ };

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

  const [removeMessage] = useMutation(REMOVE_MESSAGE, {
    update: (cache) => {
      cache.modify({
        fields: {
          messages({ DELETE }) {
            return DELETE;
          },
        },
      });
    },
    onError(error) {
      console.log(`Помилка при видаленні повідомлення ${error}`);
    },
  });

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
        <Box
          sx={{ position: 'relative', background: 'red', margin: '0px 65px' }}
        >
          {closeBtnReplyMsg}
          {buttonEndActive}
        </Box>
      );
    }
  }, [closeBtnReplyMsg]);

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
  }, [activeChannelId, activeDirectMessageId, modalAddPeopleIsOpen])();

  const handleAnswer = () => {
    setOpenPopup(null);
    setCloseBtnReplyMsg(popupMessage.text);
    inputRef.current.focus();
    inputRef.current.value = '';
  };

  const handleChange = () => {
    setCloseBtnChangeMsg(true);
    setOpenPopup(null);
    changeMessageRef.current = popupMessage;
    inputRef.current.focus();
    inputRef.current.value = popupMessage.text;
  };

  const handleDelete = () => {
    setOpenPopup(null);
    removeMessage({
      variables: { id: popupMessage.id, chatType: popupMessage.chatType },
    });
  };

  const handleCancel = () => {
    setOpenPopup(null);
  };

  return (
    <Box>
      {setHeader}
      {contentMessages()}
      {fieldAnswerTo()}
      <Box
        sx={{ background: theme.palette.primary.main }}
        style={{ display: !openPopup && 'none' }}
      >
        <Button
          sx={stylesButton}
          size='small'
          variant='contained'
          color='primary'
          startIcon={<ReplyIcon />}
          onClick={handleAnswer}
        >
          ANSWER
        </Button>
        <Button
          sx={stylesButton}
          size='small'
          variant='contained'
          color='primary'
          startIcon={<EditIcon />}
          onClick={handleChange}
        >
          CHANGE
        </Button>
        <Button
          sx={stylesButton}
          size='small'
          variant='contained'
          color='primary'
          startIcon={<ForwardIcon />}
          onClick={() => setOpenPopup(null)}
        >
          FORWARD
        </Button>
        <Button
          sx={stylesButton}
          size='small'
          variant='contained'
          color='error'
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
        >
          DELETE
        </Button>
        <Button
          sx={stylesButton}
          size='small'
          variant='contained'
          color='info'
          startIcon={<DeleteIcon />}
          onClick={handleCancel}
        >
          CANCEL
        </Button>
      </Box>
      <Box style={{ display: openPopup && 'none' }}>
        <InputUpdateMessages
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
