import React, { useEffect } from 'react';
import { useMutation, useReactiveVar } from '@apollo/client';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/system';
import Button from '@mui/material/Button';
import ReplyIcon from '@mui/icons-material/Reply';
import EditIcon from '@mui/icons-material/Edit';
import ForwardIcon from '@mui/icons-material/Forward';
import DeleteIcon from '@mui/icons-material/Delete';
import { REMOVE_MESSAGE } from '../ConversationGraphQL/queryes';
import { reactiveVarId, activeChatId } from '../../../GraphQLApp/reactiveVars';

const stylesButton = { margin: 1 /* border: '1px solid rebeccapurple' */ };

export function ConversationActionsMessage(props) {
  const {
    openPopup,
    setOpenPopup,
    setCloseBtnReplyMsg,
    inputRef,
    setCloseBtnChangeMsg,
    changeMessageRef,
    popupMessage,
  } = props;
  const theme = useTheme();
  const userId = useReactiveVar(reactiveVarId);
  const activeChannelId = useReactiveVar(activeChatId).activeChannelId;
  const activeDirectMessageId =
    useReactiveVar(activeChatId).activeDirectMessageId;

  useEffect(() => {
    setOpenPopup(null);
  }, [activeChannelId, activeDirectMessageId]);

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

  const handleAnswer = () => {
    setOpenPopup(null);
    setCloseBtnReplyMsg(true);
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
    <Box
      sx={{ background: theme.palette.primary.main, maxWidth: 'fit-content' }}
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
      {popupMessage && popupMessage.senderId === userId && (
        <Button
          sx={stylesButton}
          size='small'
          variant='contained'
          color='primary'
          startIcon={<EditIcon />}
          onClick={handleChange}
        >
          EDIT
        </Button>
      )}
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
      {popupMessage && popupMessage.senderId === userId && (
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
      )}
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
  );
}
