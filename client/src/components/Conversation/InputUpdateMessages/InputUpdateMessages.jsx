import React, { useMemo } from 'react';
import {
  ThemeProvider,
  makeStyles,
  createMuiTheme,
} from '@material-ui/core/styles';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { gql, useMutation, useQuery, useReactiveVar } from '@apollo/client';
import {
  CREATE_MESSAGE,
  CHANGE_MESSAGE,
  GET_MESSAGES,
  AUTH,
} from '../../GraphQL/queryes';
import { wsSend } from '../../../WebSocket/soket';
import { messageDate } from '../../Helpers/DateCreators';
import './input-message.sass';
import {
  reactiveActiveChannelId,
  reactiveActiveDirrectMessageId,
} from '../../GraphQL/reactiveVariables';

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

export const InputUpdateMessages = React.memo((props) => {
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
  const activeChannelId = useReactiveVar(reactiveActiveChannelId);
  const activeDirectMessageId = useReactiveVar(reactiveActiveDirrectMessageId);

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

  const [createMessage, { error }] = useMutation(CREATE_MESSAGE, {
    update: (cache, { data: { createMessage } }) => {
      // Read the data from our cache for this query.
      const cacheMsg = cache.readQuery({
        query: GET_MESSAGES,
        variables: { chatId, chatType, userId: auth.id },
      });
      const chatMessages =
        cacheMsg && cacheMsg.messages && cacheMsg.messages.chatMessages
          ? cacheMsg.messages.chatMessages
          : [];
      if (cacheMsg) {
        cache.writeQuery({
          query: GET_MESSAGES,
          data: {
            messages: {
              ...cacheMsg.messages,
              chatMessages: [...chatMessages, createMessage],
            },
          },
        });
      }
    },
    onCompleted(data) {
      const messageData = data.createMessage;
      wsSend({
        meta: 'sendMessage',
        action: 'create',
        room: messageData.chatId,
        message: messageData,
      });
    },
  });

  const [changeMessage] = useMutation(CHANGE_MESSAGE, {
    onError(error) {
      console.log(`Помилка ${error}`);
    },
    onCompleted(data) {
      const messageData = data.changeMessage;
      wsSend({
        meta: 'sendMessage',
        action: 'change',
        room: messageData.chatId,
        message: messageData,
      });
    },
  });

  function inputUpdateMessages(event) {
    event.preventDefault();
    const inputValue = inputRef.current.children[1].children[0].value;

    if (!(inputValue.trim() === '')) {
      if (closeBtnChangeMsg) changeMessageText(inputValue);
      else if (closeBtnReplyMsg) messageInReply(inputValue);
      else newMessage(inputValue);
      inputRef.current.children[1].children[0].value = null;
    }
  }

  async function changeMessageText(text) {
    const newMsg = { id: changeMessageRef.current.id, text, chatType };
    changeMessage({ variables: newMsg });
    changeMessageRef.current = null;
    setCloseBtnChangeMsg(null);
  }

  const messageInReply = (text) => {
    const replyMsg = {
      userId: auth.id,
      userName: auth.name,
      replyOn: closeBtnReplyMsg,
      text,
      chatId,
      chatType,
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
          userId: auth.id,
          userName: auth.name,
          __typename: 'Message',
        },
      },
    });
    setCloseBtnReplyMsg(null);
  };

  function newMessage(textMessage) {
    const newMsg = {
      userId: auth.id,
      userName: auth.name,
      text: textMessage,
      chatId,
      chatType,
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
          userId: auth.id,
          userName: auth.name,
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
                className={'conversation-input__input'}
                label='Enter text'
                id='mui-theme-provider-standard-input'
                ref={inputRef}
              />
            </ThemeProvider>
          </form>
        </Grid>
      </Grid>
    </div>
  );
});
