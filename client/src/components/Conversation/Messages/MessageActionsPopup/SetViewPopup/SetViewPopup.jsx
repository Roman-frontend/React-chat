import React, { useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import ReplyIcon from '@mui/icons-material/Reply';
import EditIcon from '@mui/icons-material/Edit';
import ForwardIcon from '@mui/icons-material/Forward';
import DeleteIcon from '@mui/icons-material/Delete';
import { AUTH } from '../../../../../GraphQLApp/queryes';
import { REMOVE_MESSAGE } from '../../../ConversationGraphQL/queryes';
import { useQuery, useMutation } from '@apollo/client';

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
  const { data: auth } = useQuery(AUTH);
  const popupRef = useRef();

  console.log(topPopupRelativeTopPage);

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
    onError(error) {
      console.log(`Помилка при видаленні повідомлення ${error}`);
    },
  });

  useEffect(() => {
    document.addEventListener('click', hidePopup);
  }, []);

  function hidePopup(event) {
    console.log('do hide');
    setPopupMessage(null);
    document.removeEventListener('click', hidePopup);
  }

  const handleAnswer = () => {
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
        startIcon={<ReplyIcon />}
        onClick={handleAnswer}
      >
        ANSWER
      </Button>
      <Button
        size='small'
        variant='contained'
        color='primary'
        startIcon={<EditIcon />}
        onClick={handleChange}
      >
        CHANGE
      </Button>
      <Button
        size='small'
        variant='contained'
        color='primary'
        startIcon={<ForwardIcon />}
      >
        FORWARD
      </Button>
      <Button
        size='small'
        variant='contained'
        color='secondary'
        startIcon={<DeleteIcon />}
        onClick={handleDelete}
      >
        DELETE
      </Button>
    </div>
  );
};
