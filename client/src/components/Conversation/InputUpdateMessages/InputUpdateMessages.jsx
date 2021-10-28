import React, { useMemo, memo } from 'react';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import Grid from '@mui/material/Grid';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { AUTH } from '../../../GraphQLApp/queryes';
import {
  CREATE_MESSAGE,
  CHANGE_MESSAGE,
  GET_MESSAGES,
} from '../ConversationGraphQL/queryes';
import { wsSend } from '../../../WebSocket/soket';
import { messageDate } from '../../Helpers/DateCreators';
import { activeChatId } from '../../../GraphQLApp/reactiveVars';
import './input-message.sass';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    flexGrow: 1,
    fontSize: '3rem',
    textAlign: 'right',
  },
  addPeoples: {
    //padding: theme.spacing(1),
    textAlign: 'bottom',
  },
}));

const theme = createTheme({
  palette: {
    color: '#115293',
  },
});

export const InputUpdateMessages = memo((props) => {
  const {
    changeMessageRef,
    closeBtnChangeMsg,
    setCloseBtnChangeMsg,
    closeBtnReplyMsg,
    setCloseBtnReplyMsg,
    inputRef,
  } = props;
  const classes = useStyles();
  const { data: auth } = useQuery(AUTH);
  const activeChannelId = useReactiveVar(activeChatId).activeChannelId;
  const activeDirectMessageId =
    useReactiveVar(activeChatId).activeDirectMessageId;
  const theme = useTheme();

  const chatType = useMemo(() => {
    return activeDirectMessageId
      ? 'DirectMessage'
      : activeChannelId
      ? 'Channel'
      : null;
  }, [activeChannelId, activeDirectMessageId]);

  const chatId = useMemo(() => {
    return activeDirectMessageId
      ? activeDirectMessageId
      : activeChannelId
      ? activeChannelId
      : null;
  }, [activeChannelId, activeDirectMessageId]);

  const [createMessage] = useMutation(CREATE_MESSAGE, {
    update: (cache, { data: { message } }) => {
      console.log(message);
      const cacheMsg = cache.readQuery({
        query: GET_MESSAGES,
        variables: { chatId, chatType, userId: auth.id },
      });
      const chatMessages =
        cacheMsg && cacheMsg.messages && cacheMsg.messages.chatMessages
          ? cacheMsg.messages.chatMessages
          : [];
      if (cacheMsg && message) {
        console.log(message);
        cache.modify({
          fields: {
            messages() {
              return {
                ...cacheMsg.messages,
                chatMessages: [...chatMessages, message.create],
              };
            },
          },
        });
      }
    },
    onCompleted(data) {
      const createdMessage = data.message.create;
      sendMessageToWS(createdMessage);
    },
  });

  const [changeMessage] = useMutation(CHANGE_MESSAGE, {
    update: (cache, { data: { message } }) => {
      const cacheMsg = cache.readQuery({
        query: GET_MESSAGES,
        variables: { chatId, chatType, userId: auth.id },
      });
      const chatMessages =
        cacheMsg && cacheMsg.messages && cacheMsg.messages.chatMessages
          ? cacheMsg.messages.chatMessages
          : [];
      if (cacheMsg && message) {
        const changeMessages = chatMessages.map((msg) => {
          return msg.id === message.change.id ? message.change : msg;
        });
        cache.writeQuery({
          query: GET_MESSAGES,
          data: {
            messages: { ...cacheMsg.messages, chatMessages: changeMessages },
          },
        });
      }
    },
    onError(error) {
      console.log(`Помилка ${error}`);
    },
    onCompleted(data) {
      const changedMessage = data.message.change;
      sendMessageToWS(changedMessage);
    },
  });

  function sendMessageToWS(data) {
    wsSend({
      meta: 'sendMessage',
      action: 'change',
      room: data.chatId,
      message: data,
    });
  }

  function inputUpdateMessages(event) {
    event.preventDefault();
    const value = inputRef.current.value;
    console.log(value, event.target.value);

    //event.shiftKey - містить значення true - коли користувач нажме деякі з клавіш утримуючи shift
    if (value.trim() !== '' && !event.shiftKey && event.key === 'Enter') {
      if (closeBtnChangeMsg) changeMessageText(value);
      else if (closeBtnReplyMsg) messageInReply(value);
      else newMessage(value);
      inputRef.current.value = null;
    }
  }

  async function changeMessageText(text) {
    const newMsg = { id: changeMessageRef.current.id, text, chatType };
    changeMessage({ variables: { input: newMsg } });
    changeMessageRef.current = null;
    setCloseBtnChangeMsg(null);
  }

  const messageInReply = (text) => {
    const replyMsg = {
      chatId,
      chatType,
      senderId: auth.id,
      replyOn: closeBtnReplyMsg,
      text,
    };
    createMessage({
      variables: replyMsg,
      optimisticResponse: {
        createMessage: {
          chatId,
          chatType,
          createdAt: messageDate(),
          id: messageDate(),
          replyOn: null,
          text,
          senderId: auth.id,
        },
      },
    });
    setCloseBtnReplyMsg(null);
  };

  function newMessage(textMessage) {
    const newMsg = {
      chatId,
      chatType,
      senderId: auth.id,
      text: textMessage,
    };

    createMessage({
      variables: newMsg,
      optimisticResponse: {
        createMessage: {
          chatId,
          chatType,
          createdAt: messageDate(),
          id: messageDate(),
          replyOn: null,
          text: textMessage,
          senderId: auth.id,
        },
      },
    });
  }

  console.log('input open');

  return (
    <div className={classes.root} id='mainInput'>
      <Grid container spacing={1}>
        <Grid item xs={1}>
          <BorderColorIcon
            color='input'
            className={classes.addPeoples}
            style={{ fontSize: 40, top: '1rem' }}
          />
        </Grid>
        <Grid item xs={11}>
          <TextField
            //className={classes.root}
            color='input'
            id='standard-basic'
            label='Enter text'
            variant='standard'
            inputRef={inputRef}
            autoFocus={true}
            onKeyUp={(event) => inputUpdateMessages(event)}
            sx={{
              width: '-webkit-fill-available',
              '& .MuiInput-input': {
                color: '#000000',
              },
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
});
