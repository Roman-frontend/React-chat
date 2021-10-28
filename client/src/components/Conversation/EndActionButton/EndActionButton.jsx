import React from 'react';
import CancelPresentationOutlinedIcon from '@mui/icons-material/CancelPresentationOutlined';
import './end-action-button.sass';

export default function EndActionButton(props) {
  const {
    setCloseBtnChangeMsg,
    closeBtnReplyMsg,
    setCloseBtnReplyMsg,
    inputRef,
    changeMessageRef,
  } = props;
  const topInput = document
    .getElementById('mainInput')
    .getBoundingClientRect().top;
  const topButtonClose = closeBtnReplyMsg ? topInput - 56 : topInput;

  function hideButtonExit() {
    setCloseBtnReplyMsg(null);
    setCloseBtnChangeMsg(null);
    changeMessageRef.current = null;
    inputRef.current.value = '';
  }

  return (
    <CancelPresentationOutlinedIcon
      className='conversation-input__end-action-button'
      //style={{ top: `${topButtonClose}px` }}
      fontSize='large'
      type='checkbox'
      id='checkbox'
      name='checkbox'
      onClick={hideButtonExit}
      inputprops={{ 'aria-label': 'primary checkbox' }}
    />
  );
}
