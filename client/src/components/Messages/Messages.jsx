import React, { useCallback, useMemo, useEffect } from "react";
import {
  GET_MESSAGES,
  PROCESSED_NEW_MESSAGE,
  UPDATE_MESSAGES,
} from "../../redux/types";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import { getData } from "../../redux/actions/actions.js";
import Message from "../Message/Message.jsx";
import MessageActionsPopup from "../MessageActionsPopup/MessageActionsPopup.jsx";
import "./messages.sass";

export function Messages(props) {
  const { activeMessage, setActiveMessage, inputRef, socket } = props;
  const dispatch = useDispatch();
  const reduxMessages = useSelector((state) => state.messages);
  const activeChannelId = useSelector((state) => state.activeChannelId);
  const token = useSelector((state) => state.token);
  const userId = useSelector((state) => state.userData._id);
  const newMessage = useSelector((state) => state.newMessage);

  //Підписуємось на подію що спрацює при отриманні повідомлення
  socket.onmessage = (response) => {
    if (response.data !== "З'єднання з WebSocket встановлено") {
      const parsedRes = JSON.parse(response.data);
      console.log(reduxMessages);
      if (reduxMessages[0] && reduxMessages[0]._id !== parsedRes._id) {
        dispatch({
          type: UPDATE_MESSAGES,
          payload: reduxMessages.reverse().concat(parsedRes),
        });
      }
    }
  };

  //Підписуємось на закриття події
  socket.onclose = (response) => {
    console.log(response);
    if (response.wasClean) {
      console.log(
        `DISCONNECTED CLEAN with code ${response.code} reason ${response.reason}`
      );
    } else {
      console.log(
        `DISCONNECTED BROKEN with code ${response.code} reason ${response.reason}`
      );
    }
  };

  useEffect(() => {
    async function getMessages() {
      await dispatch(getData(GET_MESSAGES, token, activeChannelId, { userId }));
    }

    if (activeChannelId && activeChannelId !== "1") getMessages();
  }, [activeChannelId]);

  useEffect(() => {
    if (newMessage) {
      console.log("socket.send => ");
      socket.send(JSON.stringify(newMessage));
      dispatch({
        type: PROCESSED_NEW_MESSAGE,
        payload: null,
      });
    }
  }, [newMessage]);

  const reverseMsg = useMemo(() => {
    if (reduxMessages === "403") {
      return "403";
    } else {
      const messages = reduxMessages;
      console.log(messages);
      return messages.reverse();
    }
  }, [reduxMessages]);

  const renderMessages = useCallback(() => {
    if (reduxMessages !== "403") {
      console.log(reverseMsg);
      return reverseMsg.map((message) => {
        return (
          <Message
            key={message._id || message.id}
            message={message}
            activeMessage={activeMessage}
            setActiveMessage={setActiveMessage}
          />
        );
      });
    }
  }, [reduxMessages, activeMessage]);

  return (
    <div className="messages">
      {renderMessages()}
      <MessageActionsPopup
        activeMessage={activeMessage}
        setActiveMessage={setActiveMessage}
        inputRef={inputRef}
      />
    </div>
  );
}

const mapDispatchToProps = {
  getData,
};

export default connect(null, mapDispatchToProps)(Messages);
