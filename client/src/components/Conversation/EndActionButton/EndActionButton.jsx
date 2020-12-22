import React from 'react';
import CancelPresentationOutlinedIcon from '@material-ui/icons/CancelPresentationOutlined';
import './end-action-button.sass';

export default function EndActionButton(props) {
  const {
    setCloseBtnChangeMsg,
    closeBtnReplyMsg,
    setCloseBtnReplyMsg,
    inputRef,
  } = props;
  const topInput = document
    .querySelector('.conversation-input__input')
    .getBoundingClientRect().top;
  const topButtonClose = closeBtnReplyMsg ? topInput - 56 : topInput;

  function hideButtonExit() {
    setCloseBtnReplyMsg(null);
    setCloseBtnChangeMsg(null);
    inputRef.current.children[1].children[0].value = '';
  }

  return (
    <CancelPresentationOutlinedIcon
      className='conversation-input__end-action-button'
      style={{ top: `${topButtonClose}px` }}
      fontSize='large'
      type='checkbox'
      id='checkbox'
      name='checkbox'
      onClick={hideButtonExit}
      inputprops={{ 'aria-label': 'primary checkbox' }}
    />
  );
}
