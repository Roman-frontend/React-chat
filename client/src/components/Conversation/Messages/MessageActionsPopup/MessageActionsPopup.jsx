import React, { useState, useMemo } from "react";
import Tippy from "@tippy.js/react";
import "tippy.js/dist/tippy.css";
import SetViewPopup from "./SetViewPopup/SetViewPopup.jsx";
import iconMore from "../../../../images/icon-more.png";
import "./message-actions-popup.sass";

export default function MessageActionsPopup(props) {
  const { activeMessage, setActiveMessage, inputRef } = props;
  const [idMessageForPopup, setIdMessageForPopup] = useState(null);

  const topPopupRelativeTopPage = useMemo(() => {
    if (idMessageForPopup) {
      return getPlaceTopElement(idMessageForPopup);
    }
  }, [idMessageForPopup]);

  const topIconActionRelativeTopPage = useMemo(() => {
    if (activeMessage.id) {
      return getPlaceTopElement(activeMessage.id);
    }
  }, [activeMessage.id]);

  function getPlaceTopElement(idElement) {
    const element = document.getElementById(idElement);
    return element.getBoundingClientRect().top + 4;
  }

  function setViewIconActions() {
    if (topIconActionRelativeTopPage) {
      return (
        <Tippy content="Actions">
          <img
            className="popup popup_closed"
            style={{ top: `${topIconActionRelativeTopPage}px` }}
            src={iconMore}
            onClick={() => setIdMessageForPopup(activeMessage.id)}
          />
        </Tippy>
      );
    }

    return null;
  }

  return (
    <>
      {setViewIconActions()}
      <SetViewPopup
        topPopupRelativeTopPage={topPopupRelativeTopPage}
        activeMessage={activeMessage}
        setActiveMessage={setActiveMessage}
        inputRef={inputRef}
        setIdMessageForPopup={setIdMessageForPopup}
      />
    </>
  );
}
