import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import {
  removeChannelMessage,
  removeMessageOfDirectMessage,
} from "../../../../../redux/actions/actions";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import ReplyIcon from "@material-ui/icons/Reply";
import EditIcon from "@material-ui/icons/Edit";
import ForwardIcon from "@material-ui/icons/Forward";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(0),
  },
}));

function SetViewPopup(props) {
  const {
    topPopupRelativeTopPage,
    activeMessage,
    setActiveMessage,
    inputRef,
    setIdMessageForPopup,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const activeChannelId = useSelector((state) => state.activeChannelId);
  const activeDirectMessageId = useSelector(
    (state) => state.activeDirectMessageId
  );

  const handleAnswer = () => {
    setIdMessageForPopup(null);
    const valueAnsweringActiveMessage = activeMessage.reply
      ? undefined
      : activeMessage.message;
    const object = Object.assign(
      {},
      { ...activeMessage },
      { reply: valueAnsweringActiveMessage }
    );
    setActiveMessage({ ...object });
    inputRef.current.children[1].children[0].value = "";
  };

  const handleChange = () => {
    let valueChangingActiveMessage;
    setIdMessageForPopup(null);

    if (activeMessage.changing) {
      valueChangingActiveMessage = undefined;
      inputRef.current.children[1].children[0].value = "";
    } else {
      valueChangingActiveMessage = activeMessage.message;
      inputRef.current.children[1].children[0].value =
        activeMessage.message.text;
    }

    const object = Object.assign(
      {},
      { ...activeMessage },
      { changing: valueChangingActiveMessage }
    );
    setActiveMessage({ ...object });
  };

  const handleDelete = async () => {
    setIdMessageForPopup(null);
    setActiveMessage({});

    if (activeChannelId) {
      dispatch(removeChannelMessage(token, activeMessage.message._id));
    } else if (activeDirectMessageId) {
      dispatch(removeMessageOfDirectMessage(token, activeMessage.message._id));
    }
  };

  if (topPopupRelativeTopPage) {
    return (
      <div
        className="field-actions popup popup_opened"
        style={{ top: `${topPopupRelativeTopPage}px` }}
      >
        <Button
          size="small"
          variant="contained"
          color="primary"
          className={classes.button}
          startIcon={<ReplyIcon />}
          onClick={handleAnswer}
        >
          ANSWER
        </Button>
        <Button
          size="small"
          variant="contained"
          color="primary"
          className={classes.button}
          startIcon={<EditIcon />}
          onClick={handleChange}
        >
          CHANGE
        </Button>
        <Button
          size="small"
          variant="contained"
          color="primary"
          className={classes.button}
          startIcon={<ForwardIcon />}
        >
          FORWARD
        </Button>
        <Button
          size="small"
          variant="contained"
          color="secondary"
          className={classes.button}
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
        >
          DELETE
        </Button>
      </div>
    );
  }

  return null;
}

const mapDispatchToProps = {
  removeChannelMessage,
  removeMessageOfDirectMessage,
};

export default connect(null, mapDispatchToProps)(SetViewPopup);
