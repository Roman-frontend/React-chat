import React, { useEffect } from 'react';
import {
  ThemeProvider,
  makeStyles,
  createMuiTheme,
} from '@material-ui/core/styles';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { gql, useMutation, useQuery } from '@apollo/client';
import {
  CREATE_MESSAGE,
  UPDATE_MESSAGE,
  GET_MESSAGES,
  APP,
  AUTH,
} from '../../GraphQL/queryes';
import { wsSend } from '../../../WebSocket/soket';
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
  const { data: activeChat } = useQuery(APP);
  const chatId =
    activeChat && activeChat.activeChannelId
      ? activeChat.activeChannelId
      : activeChat && activeChat.activeDirectMessageId
      ? activeChat.activeDirectMessageId
      : null;
  const chatType =
    activeChat && activeChat.activeChannelId ? 'Channel' : 'DirectMessage';

  const [createMessage] = useMutation(CREATE_MESSAGE, {
    update: (proxy, { data: { createMessage } }) => {
      // Read the data from our cache for this query.
      const data = proxy.readQuery({ query: GET_MESSAGES });
      // Write our data back to the cache with the new comment in it
      proxy.writeQuery({
        query: GET_MESSAGES,
        data: {
          messages: [...data.messages, createMessage],
        },
      });
    },
    onError(error) {
      console.log(`Помилка ${error}`);
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

  const [changeMessage] = useMutation(UPDATE_MESSAGE, {
    update(cache) {
      cache.modify({
        fields: {
          messages(existingMessages = []) {
            return [...existingMessages];
          },
        },
      });
    },
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

  async function changeMessageText(inputValue) {
    const newMsg = {
      id: changeMessageRef.current.id,
      text: inputValue,
      createdAt: Date.now().toString(),
      chatType: changeMessageRef.current.chatType,
    };
    changeMessage({ variables: { ...newMsg } });
    changeMessageRef.current = null;
    setCloseBtnChangeMsg(null);
  }

  const messageInReply = (response) => {
    const replyMsg = {
      userId: auth.id,
      userName: auth.name,
      replyOn: closeBtnReplyMsg,
      text: response,
      chatId,
      chatType,
    };
    createMessage({ variables: { ...replyMsg } });
    setCloseBtnReplyMsg(null);
  };

  function formattedDate() {
    const rowDate = new Date(parseInt(Date.now()));
    let result = '';
    result +=
      rowDate.getHours() +
      ':' +
      rowDate.getMinutes() +
      ':' +
      rowDate.getSeconds();
    return result;
  }

  function newMessage(textMessage) {
    const newMsg = {
      userId: auth.id,
      userName: auth.name,
      text: textMessage,
      chatId,
      chatType,
    };

    createMessage({
      variables: { ...newMsg },
      optimisticResponse: {
        createMessage: {
          chatId,
          chatType,
          createdAt: formattedDate(),
          id: '607703c23e21201041cb84cb',
          replyOn: null,
          text: 'edited',
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
