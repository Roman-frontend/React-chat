import React, { useEffect } from 'react';
import {
  ThemeProvider,
  makeStyles,
  createMuiTheme,
} from '@material-ui/core/styles';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { useSelector } from 'react-redux';
import { gql, useMutation } from '@apollo/client';
import { CREATE_MESSAGE, UPDATE_MESSAGE } from '../Messages/GraphQL/queryes';
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
  const name = useSelector((state) => state.userData.name);
  const userId = useSelector((state) => state.userData._id);
  const activeChannelId = useSelector((state) => state.activeChannelId);
  const activeDirectMessageId = useSelector(
    (state) => state.activeDirectMessageId
  );
  const chatId = activeChannelId ? activeChannelId : activeDirectMessageId;
  const chatType = activeChannelId ? 'Channel' : 'DirectMessage';

  const [createMessage] = useMutation(CREATE_MESSAGE, {
    update(cache, { data: { createMessage } }) {
      cache.modify({
        fields: {
          messages(existingMessages = []) {
            const newMessageRef = cache.writeFragment({
              data: createMessage,
              fragment: gql`
                fragment CreateMessages on Message {
                  id
                  userName
                  userId
                  text
                  replyOn
                  chatId
                  chatType
                  createdAt
                }
              `,
            });
            console.log(existingMessages, newMessageRef);
            return [...existingMessages, newMessageRef];
          },
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
      userId,
      userName: name,
      replyOn: closeBtnReplyMsg,
      text: response,
      chatId,
      chatType,
    };
    createMessage({ variables: { ...replyMsg } });
    setCloseBtnReplyMsg(null);
  };

  function newMessage(textMessage) {
    const newMsg = {
      userId,
      userName: name,
      text: textMessage,
      chatId,
      chatType,
    };
    createMessage({ variables: { ...newMsg } });
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
