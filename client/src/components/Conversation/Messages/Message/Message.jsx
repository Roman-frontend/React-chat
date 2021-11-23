import React, { useMemo, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import imageProfile from '../../../../images/User-Icon.png';
import { messageDate } from '../../../Helpers/DateCreators';
import { GET_USERS } from '../../../../GraphQLApp/queryes';
import { Loader } from '../../../Helpers/Loader';
import './message.sass';

const Message = memo(
  ({
    message,
    openPopup,
    setOpenPopup,
    setPopupMessage,
    setCloseBtnChangeMsg,
    setCloseBtnReplyMsg,
  }) => {
    const { text, createdAt, updatedAt, id, senderId, replyOn } = message;
    const { t } = useTranslation();
    const theme = useTheme();
    const { data: users, loading } = useQuery(GET_USERS);

    const senderName = useMemo(() => {
      return users.users.find((user) => {
        return user.id === senderId;
      }).name;
    }, [users]);

    const classMessage = replyOn ? 'container-reply' : 'container';
    const replyMessage = replyOn ? (
      <div className={`${classMessage}__reply`}>
        <p
          style={{
            fontWeight: 600,
            color: theme.palette.primary.contrastText,
            margin: '15px 0px 20px 0px',
          }}
        >
          {senderName}
        </p>
        <p style={{ margin: '0px 0px 10px 0px' }}>{replyOn}</p>
      </div>
    ) : null;

    const handleClick = () => {
      setOpenPopup((prev) => {
        return prev === id ? null : id;
      });
      setCloseBtnChangeMsg(null);
      setCloseBtnReplyMsg(null);
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
          <img
            src={imageProfile}
            className={`${classMessage}__icon`}
            style={{
              borderRadius: 0,
              height: 40,
              width: 40,
            }}
          />
          <p
            style={{ color: theme.palette.primary.contrastText }}
            className={`${classMessage}__messager`}
          >
            {senderName}
          </p>
          <p className={`${classMessage}__date`}>{messageDate(createdAt)}</p>
          <p
            style={{
              display: updatedAt && updatedAt !== createdAt ? 'block' : 'none',
              fontSize: 11,
            }}
            className={`${classMessage}__info`}
          >
            {`${t('description.editedMessage')}: ${messageDate(
              updatedAt || createdAt
            )}`}
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
