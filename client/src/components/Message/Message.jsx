import React from "react";
import Box from "@material-ui/core/Box";
import PersonIcon from "@material-ui/icons/Person";
import "./message.sass";

export default function Message(props) {
  const { message, activeMessage, setActiveMessage } = props;
  const { username, text, createdAt, _id, id } = message;
  const messageId = _id ? _id : id;

  const classMessage = message.reply ? "container-reply" : "container";
  const replyMessage = message.reply ? (
    <p className={`${classMessage}__reply`}>&#8593; {message.reply}</p>
  ) : null;

  const reportChoice = () => {
    const newActive = Object.assign(
      {},
      { ...activeMessage },
      { id: messageId },
      { message }
    );
    setActiveMessage({ ...newActive });
  };

  return (
    <div className={classMessage} id={messageId} onMouseEnter={reportChoice}>
      <Box>
        <PersonIcon
          className={`${classMessage}__icon`}
          style={{ fontSize: 50 }}
          alt="icon-user"
        />
      </Box>
      <p className={`${classMessage}__messager`}>{username}</p>
      <p className={`${classMessage}__date`}>{createdAt}</p>
      <p className={`${classMessage}__message`}>{text}</p>
      {replyMessage}
    </div>
  );
}
