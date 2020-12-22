import React, { useState, useMemo } from 'react';
import Tippy from '@tippy.js/react';
import 'tippy.js/dist/tippy.css';
import SetViewPopup from './SetViewPopup/SetViewPopup.jsx';
import iconMore from '../../../../images/icon-more.png';
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
    const inputEl = document.getElementById('mainInput');
    if (popupMessage) {
      console.log(popupMessage);
      const topPlacing = getPlaceTopElement(popupMessage._id);
      if (inputEl.getBoundingClientRect().top - topPlacing > 143) {
        return topPlacing;
      } else return topPlacing - 100;
    }
  }, [popupMessage]);

  const topIconActionRelativeTopPage = useMemo(() => {
    if (activeMessage) {
      return getPlaceTopElement(activeMessage._id);
    }
  }, [activeMessage]);

  function getPlaceTopElement(idElement) {
    const element = document.getElementById(idElement);
    return element.getBoundingClientRect().top + 4;
  }

  const changeIdForPopup = () => {
    setPopupMessage((prev) => {
      return prev === activeMessage ? null : activeMessage;
    });
  };

  function isShowButtonMore() {
    if (topIconActionRelativeTopPage) {
      return (
        <Tippy content='Actions'>
          <img
            className='popup popup_closed'
            style={{ top: `${topIconActionRelativeTopPage}px` }}
            src={iconMore}
            onClick={changeIdForPopup}
          />
        </Tippy>
      );
    }
  }

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
      {isShowButtonMore()}
      {isShowPopupActions()}
    </>
  );
}
