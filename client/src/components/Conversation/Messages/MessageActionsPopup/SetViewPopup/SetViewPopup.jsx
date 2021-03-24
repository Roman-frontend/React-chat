import React, { useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ReplyIcon from '@material-ui/icons/Reply';
import EditIcon from '@material-ui/icons/Edit';
import ForwardIcon from '@material-ui/icons/Forward';
import DeleteIcon from '@material-ui/icons/Delete';
import { AUTH } from '../../../../../GraphQLApp/queryes';
import { REMOVE_MESSAGE } from '../../../ConversationGraphQL/queryes';
import { useQuery, useMutation } from '@apollo/client';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(0),
  },
}));

export const SetViewPopup = (props) => {
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
  const { data: auth } = useQuery(AUTH);
  const popupRef = useRef();

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
    onCompleted(data) {
      console.log(`remove message`);
    },
    onError(error) {
      console.log(`Помилка при видаленні повідомлення ${error}`);
    },
  });

  useEffect(() => {
    document.addEventListener('click', hidePopup);
  }, []);

  function hidePopup(event) {
    //дозволяє закривати попап лише якщо натискаєш поза попапом
    /* if (popupMessage && !popupRef.current.contains(event.target)) {
      console.log('removeAddLister');
      setPopupMessage(null);
      document.removeEventListener('click', hidePopup);
    } */
    console.log('removeAddLister');
    setPopupMessage(null);
    document.removeEventListener('click', hidePopup);
  }

  const handleAnswer = () => {
    console.log(popupMessage);
    setCloseBtnReplyMsg(popupMessage.text);
    inputRef.current.children[1].children[0].focus();
    inputRef.current.children[1].children[0].value = '';
  };

  const handleChange = () => {
    setCloseBtnChangeMsg(true);
    changeMessageRef.current = popupMessage;
    inputRef.current.children[1].children[0].focus();
    inputRef.current.children[1].children[0].value = popupMessage.text;
  };

  const handleDelete = () => {
    removeMessage({
      variables: { id: popupMessage.id, chatType: popupMessage.chatType },
    });
  };

  return (
    <div
      className='field-actions popup popup_opened'
      style={{ top: `${topPopupRelativeTopPage}px` }}
      ref={popupRef}
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
};
