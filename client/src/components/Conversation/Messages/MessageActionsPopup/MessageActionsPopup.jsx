import React, { useState, useMemo } from 'react';
import { BtnMore } from '../../../Helpers/BtnMore.jsx';
import SetViewPopup from './SetViewPopup/SetViewPopup.jsx';
import './message-actions-popup.sass';

export default function MessageActionsPopup(props) {
  const {
    activeMessage,
    popupMessage,
    setPopupMessage,
    setCloseBtnChangeMsg,
    setCloseBtnReplyMsg,
    inputRef,
  } = props;

  const topPopupRelativeTopPage = useMemo(() => {
    if (popupMessage) {
      const inputEl = document.getElementById('mainInput');
      const inputTop = inputEl.getBoundingClientRect().top;
      const activeMessageEl = document.getElementById(popupMessage._id);
      const activeMessageTop = activeMessageEl.getBoundingClientRect().top + 4;
      return inputTop - activeMessageTop > 143
        ? activeMessageTop
        : activeMessageTop - 100;
    }
  }, [popupMessage]);

  const changeIdForPopup = () => {
    setPopupMessage((prev) => {
      return prev === activeMessage ? null : activeMessage;
    });
  };

  function isShowPopupActions() {
    if (topPopupRelativeTopPage) {
      return (
        <SetViewPopup
          topPopupRelativeTopPage={topPopupRelativeTopPage}
          inputRef={inputRef}
          popupMessage={popupMessage}
          setPopupMessage={setPopupMessage}
          setCloseBtnChangeMsg={setCloseBtnChangeMsg}
          setCloseBtnReplyMsg={setCloseBtnReplyMsg}
        />
      );
    }
  }

  return (
    <>
      {BtnMore(activeMessage, 'popup popup_message', changeIdForPopup)}
      {isShowPopupActions()}
    </>
  );
}
