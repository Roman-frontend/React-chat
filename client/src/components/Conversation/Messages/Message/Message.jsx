import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/icons/Person';
import imageProfile from '../../../../images/Profile.jpg';
import { messageDate } from '../../../Helpers/DateCreators';
import { useQuery } from '@apollo/client';
import { GET_USERS } from '../../../../GraphQLApp/queryes';
import { Loader } from '../../../Helpers/Loader';
import './message.sass';

export default function Message(props) {
  const { message, setPopupMessage } = props;
  const { text, createdAt, updatedAt, id, senderId, replyOn } = message;

  const { data: users, loading } = useQuery(GET_USERS);

  const senderName = useMemo(() => {
    return users.users.find((user) => {
      return user.id === senderId;
    }).name;
  }, [users]);

  const classMessage = replyOn ? 'container-reply' : 'container';
  const replyMessage = replyOn ? (
    <p className={`${classMessage}__reply`}>{replyOn}</p>
  ) : null;

  if (loading) return <Loader />;

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
      <p className={`${classMessage}__messager`}>{senderName}</p>
      <p className={`${classMessage}__date`}>
        {messageDate(updatedAt || createdAt)}
      </p>
      <p className={`${classMessage}__message`}>{text}</p>
      {replyMessage}
    </div>
  );
}

Message.propTypes = {
  message: PropTypes.object,
};
