import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connect } from 'react-redux';
import {
  removeChannelMessage,
  removeMessageOfDirectMessage,
} from '../../../../../redux/actions/actions';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ReplyIcon from '@material-ui/icons/Reply';
import EditIcon from '@material-ui/icons/Edit';
import ForwardIcon from '@material-ui/icons/Forward';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(0),
  },
}));

function SetViewPopup(props) {
  const {
    topPopupRelativeTopPage,
    inputRef,
    changeMessageRef,
    popupMessage,
    setPopupMessage,
    setCloseBtnChangeMsg,
    setCloseBtnReplyMsg,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const activeChannelId = useSelector((state) => state.activeChannelId);

  useEffect(() => {
    document.addEventListener('click', hidePopup);
  }, []);

  function hidePopup() {
    setPopupMessage(null);
    document.removeEventListener('click', hidePopup);
  }

  const handleAnswer = () => {
    console.log(popupMessage);
    setCloseBtnReplyMsg(popupMessage.text);
    setPopupMessage(null);
    inputRef.current.children[1].children[0].focus();
    inputRef.current.children[1].children[0].value = '';
  };

  const handleChange = () => {
    setCloseBtnChangeMsg(true);
    changeMessageRef.current = popupMessage;
    setPopupMessage(null);
    inputRef.current.children[1].children[0].focus();
    inputRef.current.children[1].children[0].value = popupMessage.text;
  };

  const handleDelete = async () => {
    setPopupMessage(null);
    const removeFunc = activeChannelId
      ? removeChannelMessage
      : removeMessageOfDirectMessage;
    dispatch(removeFunc(token, popupMessage._id));
  };

  return (
    <div
      className='field-actions popup popup_opened'
      style={{ top: `${topPopupRelativeTopPage}px` }}
    >
      <Button
        size='small'
        variant='contained'
        color='primary'
        className={classes.button}
        startIcon={<ReplyIcon />}
        onClick={handleAnswer}
      >
        ANSWER
      </Button>
      <Button
        size='small'
        variant='contained'
        color='primary'
        className={classes.button}
        startIcon={<EditIcon />}
        onClick={handleChange}
      >
        CHANGE
      </Button>
      <Button
        size='small'
        variant='contained'
        color='primary'
        className={classes.button}
        startIcon={<ForwardIcon />}
      >
        FORWARD
      </Button>
      <Button
        size='small'
        variant='contained'
        color='secondary'
        className={classes.button}
        startIcon={<DeleteIcon />}
        onClick={handleDelete}
      >
        DELETE
      </Button>
    </div>
  );
}

const mapDispatchToProps = {
  removeChannelMessage,
  removeMessageOfDirectMessage,
};

export default connect(null, mapDispatchToProps)(SetViewPopup);
