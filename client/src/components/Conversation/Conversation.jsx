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
    console.log(activeChannelId, storageData.lastActiveChannelId);
    if (!activeChannelId && storageData.lastActiveChannelId) {
      sendMessage(
        socket,
        JSON.stringify({ room: storageData.lastActiveChannelId, meta: "join" })
      );
    }
  }, []);

  useEffect(() => {
    if (activeMessage.reply || activeMessage.changing) {
      inputRef.current.children[1].children[0].focus();
    }
  }, [activeMessage.reply, activeMessage.changing]);

  const checkPrivate = useCallback(() => {
    if (channels && activeChannelId) {
      let openChannel = false;
      channels.forEach((channel) => {
        if (
          channel._id === activeChannelId &&
          channel.isPrivate &&
          !channel.members.includes(userId)
        ) {
          return (openChannel = true);
        }
      });
      return openChannel;
    }
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
      <img src={imageError} />
    ) : (
      <Messages
        activeMessage={activeMessage}
        setActiveMessage={setActiveMessage}
        inputRef={inputRef}
        socket={socket}
      />
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
