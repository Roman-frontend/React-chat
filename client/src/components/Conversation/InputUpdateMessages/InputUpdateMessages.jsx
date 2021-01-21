import React from 'react';
import {
  ThemeProvider,
  makeStyles,
  createMuiTheme,
} from '@material-ui/core/styles';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector } from 'react-redux';
import { connect } from 'react-redux';
import {
  postMessage,
  postMessageToDirectMsg,
  putMessage,
} from '../../../redux/actions/actions.js';
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
    closeBtnChangeMsg,
    setCloseBtnChangeMsg,
    closeBtnReplyMsg,
    setCloseBtnReplyMsg,
    inputRef,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const name = useSelector((state) => state.userData.name);
  const userId = useSelector((state) => state.userData._id);
  const token = useSelector((state) => state.token);
  const activeChannelId = useSelector((state) => state.activeChannelId);
  const activeDirectMessageId = useSelector(
    (state) => state.activeDirectMessageId
  );

  /*   useEffect(() => {
    document.addEventListener('click', hidePopup);
  }, []);

  function hidePopup() {
    setPopupMessage(null);
    document.removeEventListener('click', hidePopup);
  } */

  function inputUpdateMessages(event) {
    event.preventDefault();
    const inputValue = inputRef.current.children[1].children[0].value;

    if (!(inputValue.trim() === '')) {
      if (closeBtnChangeMsg) changeMessageText(inputValue);
      else if (closeBtnReplyMsg) messageInReply(inputValue);
      else {
        newMessage(inputValue);
      }
      inputRef.current.children[1].children[0].value = null;
    }
  }

  async function changeMessageText(inputValue) {
    /* let messageForEdit = []

    const updatedArrayMessages = reduxMessages.map(message => {
      if (message._id === closeBtnChangeMsg) {
        message.text = inputValue
        messageForEdit.push(message)
        return message
      } else return message
    })
    
    const resPut = await putMessage(messageForEdit[0], closeBtnChangeMsg, null, token) */
    setCloseBtnChangeMsg(null);
  }

  const messageInReply = (response) => {
    const chatId = activeChannelId ? activeChannelId : activeDirectMessageId;
    const replyMsg = {
      id: Date.now(),
      userId,
      username: name,
      text: closeBtnReplyMsg.text,
      createdAt: new Date().toLocaleString(),
      chatId,
      reply: response,
    };
    dispatchMessage(replyMsg, chatId);
    setCloseBtnReplyMsg(null);
  };

  function newMessage(textMessage) {
    const chatId = activeChannelId ? activeChannelId : activeDirectMessageId;
    const newMsg = {
      id: Date.now(),
      userId,
      username: name,
      text: textMessage,
      createdAt: new Date().toLocaleString(),
      chatId,
    };
    dispatchMessage(newMsg, chatId);
  }

  function dispatchMessage(message, chatId) {
    if (activeChannelId) {
      dispatch(postMessage(token, { userId, ...message }, chatId));
    } else if (activeDirectMessageId) {
      dispatch(postMessageToDirectMsg(token, { ...message }, chatId));
    }
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

const mapDispatchToProps = {
  postMessage,
  postMessageToDirectMsg,
  putMessage,
};

export default connect(null, mapDispatchToProps)(InputUpdateMessages);
