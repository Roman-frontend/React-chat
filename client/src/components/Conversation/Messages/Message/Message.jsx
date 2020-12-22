import React, { useEffect, useCallback } from 'react';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/icons/Person';
import imageProfile from '../../../../images/Profile.jpg';
import './message.sass';

export default function Message(props) {
  const { message, setActiveMessage, setPopupMessage } = props;
  const { username, text, createdAt, _id } = message;

  const classMessage = message.reply ? 'container-reply' : 'container';
  const replyMessage = message.reply ? (
    <p className={`${classMessage}__reply`}>&#8593; {message.reply}</p>
  ) : null;

  const changeIdForPopup = () => {
    setPopupMessage((prev) => (prev === message ? null : message));
  };

  return (
    <div
      className={classMessage}
      id={_id}
      onMouseEnter={() => setActiveMessage(message)}
      onClick={changeIdForPopup}
    >
      <Box>
        <Avatar
          alt='Remy Sharp'
          src={imageProfile}
          className={`${classMessage}__icon`}
          style={{ fontSize: 50 }}
        />
      </Box>
      <p className={`${classMessage}__messager`}>{username}</p>
      <p className={`${classMessage}__date`}>{createdAt}</p>
      <p className={`${classMessage}__message`}>{text}</p>
      {replyMessage}
    </div>
  );
}

{
  /* <PersonIcon
  className={`${classMessage}__icon`}
  style={{ fontSize: 50 }}
  alt='icon-user'
/> */
}
