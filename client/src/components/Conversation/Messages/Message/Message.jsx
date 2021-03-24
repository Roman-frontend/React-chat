import React from 'react';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/icons/Person';
import imageProfile from '../../../../images/Profile.jpg';
import { messageDate } from '../../../Helpers/DateCreators';
import './message.sass';

export default function Message(props) {
  const { message, setPopupMessage } = props;
  const { userName, text, createdAt, id, replyOn } = message;

  const classMessage = replyOn ? 'container-reply' : 'container';
  const replyMessage = replyOn ? (
    <p className={`${classMessage}__reply`}>{replyOn}</p>
  ) : null;

  function formattedDate(prevDate) {
    const rowDate = new Date(parseInt(prevDate));
    let result = '';
    result +=
      /* rowDate.getFullYear() +
      ' ' +
      (rowDate.getMonth() + 1) +
      ' ' +
      rowDate.getDate() +
      ' ' + */
      rowDate.getHours() +
      ':' +
      rowDate.getMinutes() +
      ':' +
      rowDate.getSeconds();
    return result;
  }

  return (
    <div
      className={classMessage}
      id={id}
      onClick={() => setPopupMessage(message)}
    >
      <Box>
        <Avatar
          alt='Remy Sharp'
          src={imageProfile}
          className={`${classMessage}__icon`}
          style={{ fontSize: 50 }}
        />
      </Box>
      <p className={`${classMessage}__messager`}>{userName}</p>
      <p className={`${classMessage}__date`}>{messageDate(createdAt)}</p>
      <p className={`${classMessage}__message`}>{text}</p>
      {replyMessage}
    </div>
  );
}
