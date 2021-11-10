import React, { useMemo, useState, memo } from 'react';
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

const Message = memo(
  ({ message, openPopup, setOpenPopup, setPopupMessage }) => {
    const { text, createdAt, updatedAt, id, senderId, replyOn } = message;
    const theme = useTheme();
    const { data: users, loading } = useQuery(GET_USERS);

    console.log('message');

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
          <p
            style={{ color: theme.palette.primary.contrastText }}
            className={`${classMessage}__messager`}
          >
            {senderName}
          </p>
          <p className={`${classMessage}__date`}>{messageDate(createdAt)}</p>
          <p
            style={{
              display: updatedAt !== createdAt ? 'block' : 'none',
              fontSize: 11,
            }}
            className={`${classMessage}__info`}
          >
            {`Edited ${messageDate(updatedAt || createdAt)}`}
          </p>
          <p
            style={{ maxWidth: 'fit-content' }}
            className={`${classMessage}__message`}
          >
            {text}
          </p>
          {replyMessage}
        </Box>
      </Box>
    );
  }
);

Message.propTypes = {
  message: PropTypes.object,
};

export default Message;
