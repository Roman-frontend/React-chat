import React, { useMemo } from 'react';
import SetViewPopup from './SetViewPopup/SetViewPopup.jsx';
import './message-actions-popup.sass';

export default function MessageActionsPopup(props) {
  const {
    popupMessage,
    setPopupMessage,
    setCloseBtnChangeMsg,
    setCloseBtnReplyMsg,
    inputRef,
    changeMessageRef,
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

  if (topPopupRelativeTopPage) {
    return (
      <SetViewPopup
        topPopupRelativeTopPage={topPopupRelativeTopPage}
        inputRef={inputRef}
<<<<<<< HEAD
        changeMessageRef={changeMessageRef}
=======
>>>>>>> bd58be86d4452ab3b6fe2b628dc8f01b0733d449
        popupMessage={popupMessage}
        setPopupMessage={setPopupMessage}
        setCloseBtnChangeMsg={setCloseBtnChangeMsg}
        setCloseBtnReplyMsg={setCloseBtnReplyMsg}
      />
    );
  }

  return null;
}
