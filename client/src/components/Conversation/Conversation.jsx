//Тут розфасовка між activeChannelId і activeDirectMessageId зроблено
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import { ConversationHeader } from "./ConversationHeader/ConversationHeader.jsx";
import { Messages } from "./Messages/Messages.jsx";
import { InputUpdateMessages } from "./InputUpdateMessages/InputUpdateMessages.jsx";
import EndActionButton from "./EndActionButton/EndActionButton.jsx";
import imageError from "../../images/error.png";
import "./conversation.sass";
import { useCallback } from "react";

export default function Conversation(props) {
  const { socket, sendMessage } = props;
  const userId = useSelector((state) => state.userData._id);
  const channels = useSelector((state) => state.channels);
  const activeChannelId = useSelector((state) => state.activeChannelId);
  const activeDirectMessageId = useSelector(
    (state) => state.activeDirectMessageId
  );
  const [activeMessage, setActiveMessage] = useState({});
  const inputRef = useRef();

  useLayoutEffect(() => {
    //Підписуємось на подію, так відкриваємо з'єднання
    socket.onopen = () => {
      console.log("ONLINE");
    };
  }, []);

  useEffect(() => {
    const storageData = JSON.parse(localStorage.getItem("userData"));
    if (
      !activeChannelId &&
      !activeDirectMessageId &&
      storageData.lastActiveChatId
    ) {
      sendMessage(
        socket,
        JSON.stringify({ room: storageData.lastActiveChatId, meta: "join" })
      );
    }
  }, []);

  useEffect(() => {
    if (activeMessage.reply || activeMessage.changing) {
      inputRef.current.children[1].children[0].focus();
    }
  }, [activeMessage.reply, activeMessage.changing]);

  const checkPrivate = useCallback(() => {
    let isOpenChat = true;
    if (channels && activeChannelId) {
      channels.forEach((channel) => {
        if (channel._id === activeChannelId) {
          if (!channel.isPrivate) {
            return (isOpenChat = true);
          } else if (channel.members.includes(userId)) {
            return (isOpenChat = true);
          } else return (isOpenChat = false);
        }
      });
    }
    return isOpenChat;
  }, [channels, activeChannelId, userId]);

  const buttonEndActive =
    activeMessage.reply || activeMessage.changing ? (
      <EndActionButton
        activeMessage={activeMessage}
        setActiveMessage={setActiveMessage}
        inputRef={inputRef}
      />
    ) : null;

  const contentMessages = () => {
    const hasNotAccesToChat = checkPrivate();

    return hasNotAccesToChat ? (
      <Messages
        activeMessage={activeMessage}
        setActiveMessage={setActiveMessage}
        inputRef={inputRef}
        socket={socket}
      />
    ) : (
      <img src={imageError} />
    );
  };

  const fieldAnswerTo = () => {
    if (activeMessage.reply) {
      return (
        <div className="conversation-riply__answer">
          {activeMessage.reply.text}
        </div>
      );
    }
  };

  return (
    <div
      className={activeMessage.reply ? "conversation-riply" : "conversation"}
    >
      <ConversationHeader />
      {fieldAnswerTo()}
      {contentMessages()}
      <div className="conversation-input">
        <InputUpdateMessages
          inputRef={inputRef}
          activeMessage={activeMessage}
          setActiveMessage={setActiveMessage}
        />
        {buttonEndActive}
      </div>
    </div>
  );
}
