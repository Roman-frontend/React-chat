import React from "react";
import {
  ThemeProvider,
  makeStyles,
  createMuiTheme,
} from "@material-ui/core/styles";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import { postData, putData } from "../../../redux/actions/actions.js";
import { POST_MESSAGE } from "../../../redux/types.js";
import "./input-message.sass";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    flexGrow: 1,
    fontSize: "3rem",
    textAlign: "right",
  },
  addPeoples: {
    padding: theme.spacing(1),
    textAlign: "bottom",
  },
}));

const theme = createMuiTheme({
  palette: {
    color: "#115293",
  },
});

export function InputUpdateMessages(props) {
  const { activeMessage, setActiveMessage, inputRef } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const name = useSelector((state) => state.userData.name);
  const userId = useSelector((state) => state.userData._id);
  const token = useSelector((state) => state.token);
  const activeChannelId = useSelector((state) => state.activeChannelId);

  function inputUpdateMessages(event) {
    event.preventDefault();
    const inputValue = inputRef.current.children[1].children[0].value;

    if (!(inputValue.trim() === "")) {
      if (activeMessage.change) changeMessageText(inputValue);
      else if (activeMessage.reply) messageInReply(inputValue);
      else {
        newMessage(inputValue);
      }
      inputRef.current.children[1].children[0].value = null;
    }
  }

  async function changeMessageText(inputValue) {
    /* let putMessage = []

    const updatedArrayMessages = reduxMessages.map(message => {
      if (message._id === activeMessage.change) {
        message.text = inputValue
        putMessage.push(message)
        return message
      } else return message
    })
    
    const resPut = await putData(putMessage[0], activeMessage.change, null, token) */
    const object = Object.assign({}, { ...activeMessage }, { change: null });
    setActiveMessage({ ...object });
  }

  const messageInReply = async (response) => {
    const replyMsg = {
      id: Date.now(),
      userId,
      username: name,
      text: activeMessage.reply.text,
      createdAt: new Date().toLocaleString(),
      channelId: activeChannelId,
      reply: response,
    };

    await dispatch(
      postData(POST_MESSAGE, token, { userId, ...replyMsg }, activeChannelId)
    );

    const object = Object.assign({}, { ...activeMessage }, { reply: null });
    setActiveMessage({ ...object });
  };

  async function newMessage(textMessage) {
    const newMsg = {
      id: Date.now(),
      userId,
      username: name,
      text: textMessage,
      createdAt: new Date().toLocaleString(),
      channelId: activeChannelId,
    };

    await dispatch(
      postData(POST_MESSAGE, token, { userId, ...newMsg }, activeChannelId)
    );

    return newMsg;
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid item xs={1}>
          <BorderColorIcon
            className={classes.addPeoples}
            style={{ fontSize: 40, top: "1rem" }}
          />
        </Grid>
        <Grid item xs={11}>
          <form
            className={classes.root}
            noValidate
            autoComplete="off"
            onSubmit={(event) => inputUpdateMessages(event)}
          >
            <ThemeProvider theme={theme}>
              <TextField
                style={{ width: "67vw" }}
                className={"conversation-input__input"}
                label="Enter text"
                id="mui-theme-provider-standard-input"
                ref={inputRef}
                autoFocus
              />
            </ThemeProvider>
          </form>
        </Grid>
      </Grid>
    </div>
  );
}

const mapDispatchToProps = {
  postData,
  putData,
};

export default connect(null, mapDispatchToProps)(InputUpdateMessages);
