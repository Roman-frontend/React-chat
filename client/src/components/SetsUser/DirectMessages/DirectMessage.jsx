import React, { memo, useState } from 'react';
import { useQuery, useReactiveVar } from '@apollo/client';
import { useTheme } from '@mui/material/styles';
import ListItem from '@mui/material/ListItem';
import Badge from '@mui/material/Badge';
import ListItemText from '@mui/material/ListItemText';
import {
  activeChatId,
  reactiveVarId,
  reactiveOnlineMembers,
} from '../../../GraphQLApp/reactiveVars';
import { GET_USERS } from '../../../GraphQLApp/queryes';
import { GET_MESSAGES } from '../../Conversation/ConversationGraphQL/queryes';
import { determineActiveChat } from '../../Helpers/determineActiveChat';
import { StyledBadgeWraper } from '../../Helpers/StyledBadge';

export const DirectMessage = memo((props) => {
  const { drMsg, key, isOpenLeftBar, dataForBadgeInformNewMsg, setChatsHasNewMsgs } =
    props;
  const [stopLogin, setStopLogin] = useState(true);
  const { data: users } = useQuery(GET_USERS);
  const usersOnline = useReactiveVar(reactiveOnlineMembers);
  const authId = useReactiveVar(reactiveVarId);
  const activeDirectMessageId =
    useReactiveVar(activeChatId).activeDirectMessageId;
  const { refetch } = useQuery(GET_MESSAGES, {
    skip: stopLogin,
    variables: { chatId: drMsg.id, chatType: 'DirectMessage', userId: authId },
    onError(data) {
      console.log('error of get messages', data);
    },
  });
  const theme = useTheme();

  function drawItem(name) {
    const friendId =
      drMsg.members[0] === authId ? drMsg.members[1] : drMsg.members[0];
    const friendIsOnline = usersOnline.includes(friendId);
    const variantDot = friendIsOnline ? 'dot' : 'standard';
    const thisDmHasNewMsgs = dataForBadgeInformNewMsg.find((dm) => dm.id === drMsg.id);
    const numNewMsgs = thisDmHasNewMsgs ? thisDmHasNewMsgs.num : 0;

    return (
      <>
        <StyledBadgeWraper variant={variantDot} name={name} />
        {isOpenLeftBar && (
          <Badge badgeContent={numNewMsgs} color='error'>
            <ListItemText
              primary={name}
              style={{ margin: '0px 4px 0px 15px' }}
            />
          </Badge>
        )}
      </>
    );
  }

  function handleClick() {
    activeChatId({ activeDirectMessageId: drMsg.id });
    if (dataForBadgeInformNewMsg[0]) {
      const thisDmHasNewMsgs = dataForBadgeInformNewMsg.find((dm) => dm.id === drMsg.id);
      if (thisDmHasNewMsgs) {
        setStopLogin(false);
        refetch({
          chatId: drMsg.id,
          chatType: 'DirectMessage',
          userId: authId,
        });
        const filteredChatHasNewMsgs = dataForBadgeInformNewMsg.filter(
          (dm) => dm.id !== drMsg.id
        );
        setChatsHasNewMsgs(filteredChatHasNewMsgs);
        setStopLogin(true);
      }
    }
  }

  if (
    typeof drMsg === 'object' &&
    drMsg !== null &&
    users &&
    Array.isArray(users.users)
  ) {
    const name = determineActiveChat(drMsg, users.users, authId);
    return (
      <ListItem
        button
        key={key}
        sx={{
          '&.Mui-selected': {
            background: theme.palette.action.active,
            color: theme.palette.leftBarItem.contrastText,
            '&:hover': {
              background: theme.palette.action.active,
            },
          },
          textAlign: 'center',
        }}
        onClick={handleClick}
        selected={activeDirectMessageId === drMsg.id && true}
      >
        {drawItem(name)}
      </ListItem>
    );
  }
  return null;
});
