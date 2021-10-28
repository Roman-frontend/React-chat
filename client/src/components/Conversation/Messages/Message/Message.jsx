import React, { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import imageProfile from '../../../../images/Profile.jpg';
import { messageDate } from '../../../Helpers/DateCreators';
import { GET_USERS } from '../../../../GraphQLApp/queryes';
import { Loader } from '../../../Helpers/Loader';
import './message.sass';

export default function Message(props) {
  const { message, openPopup, setOpenPopup, setPopupMessage } = props;
  const { text, createdAt, updatedAt, id, senderId, replyOn } = message;
  const theme = useTheme();
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

  const handleClick = () => {
    setOpenPopup((prev) => {
      return prev === id ? null : id;
    });
    setPopupMessage(message);
  };

  if (loading) return <Loader />;

  return (
    <Box
      sx={{
        position: 'relative',
        '&:hover': {
          backgroundColor: openPopup !== id && theme.palette.primary.main,
        },
        backgroundColor: openPopup === id && theme.palette.primary.dark,
      }}
    >
      <Box className={classMessage} id={id} onClick={handleClick}>
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
      </Box>
    </Box>
  );
}

Message.propTypes = {
  message: PropTypes.object,
};
