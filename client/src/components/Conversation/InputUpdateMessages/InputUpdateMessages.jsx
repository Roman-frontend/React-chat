import React, { useMemo, memo } from 'react';
import {
  ThemeProvider,
  makeStyles,
  createMuiTheme,
} from '@material-ui/core/styles';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { gql, useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { AUTH } from '../../../GraphQLApp/queryes';
import {
  CREATE_MESSAGE,
  CHANGE_MESSAGE,
  GET_MESSAGES,
} from '../ConversationGraphQL/queryes';
import { wsSend } from '../../../WebSocket/soket';
import { messageDate } from '../../Helpers/DateCreators';
import './input-message.sass';
import { activeChatId } from '../../../GraphQLApp/reactiveVars';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    flexGrow: 1,
    fontSize: '3rem',
    textAlign: 'right',
  },
  addPeoples: {
    padding: theme.spacing(1),
    textAlign: 'bottom',
  },
}));

const theme = createMuiTheme({
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
    //const value = event.target.value;
    const value = inputRef.current.children[1].children[0].value;
    console.log(value);

    //event.ctrlKey - містить значення true - коли користувач нажме деякі з клавіш утримуючи Ctrl
    if (value.trim() !== '' && event.ctrlKey && event.key === 'Enter') {
      if (closeBtnChangeMsg) changeMessageText(value);
      else if (closeBtnReplyMsg) messageInReply(value);
      else newMessage(value);
      inputRef.current.children[1].children[0].value = null;
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
          __typename: 'Message',
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
          __typename: 'Message',
        },
      },
    });
  }

  return (
    <div className={classes.root} id='mainInput'>
      <Grid container spacing={1}>
        <Grid item xs={1}>
          <BorderColorIcon
            className={classes.addPeoples}
            style={{ fontSize: 40, top: '1rem' }}
          />
        </Grid>
        <Grid item xs={11}>
          <form
            className={classes.root}
            noValidate
            autoComplete='off'
            onSubmit={(event) => inputUpdateMessages(event)}
          >
            <ThemeProvider theme={theme}>
              <TextField
                style={{ width: '67vw' }}
                label='Enter text'
                id='mui-theme-provider-standard-input'
                ref={inputRef}
                multiline={true}
                rowsMax={4}
                onKeyUp={(event) => inputUpdateMessages(event)}
                //onChange={inputUpdateMessages}
              />
            </ThemeProvider>
          </form>
        </Grid>
      </Grid>
    </div>
  );
});
