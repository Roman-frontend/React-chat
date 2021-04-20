import React, { useState, useEffect } from 'react';
import PersonIcon from '@material-ui/icons/Person';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { StyledBadge } from '../../Conversation/ConversationHeader/ConversationHeaderStyles';
import { useQuery, useReactiveVar } from '@apollo/client';
import { GET_USERS } from '../../../GraphQLApp/queryes';
import { reactiveOnlineMembers } from '../../../GraphQLApp/reactiveVariables';

export function CreateListMembers(props) {
  const { activeChannel, classes } = props;
  const [members, setMembers] = useState();
  const { data: allUsers } = useQuery(GET_USERS);
  const usersOnline = useReactiveVar(reactiveOnlineMembers);

  useEffect(() => {
    if (allUsers && Array.isArray(allUsers.users) && activeChannel) {
      createListMembers();
    }
  }, [usersOnline, activeChannel, allUsers]);

  const createListMembers = () => {
    const listMembers = getMembersActiveChannel();
    const readyList = (
      <List dense className={classes.root}>
        {listMembers.map(({ id, email }) => {
          return (
            <ListItem key={id} button>
              <ListItemAvatar>{createAvatar(id)}</ListItemAvatar>
              <ListItemText id={id} primary={email} />
            </ListItem>
          );
        })}
      </List>
    );
    setMembers(readyList);
  };

  function getMembersActiveChannel() {
    if (activeChannel && allUsers && Array.isArray(allUsers.users)) {
      return allUsers.users.filter((user) => {
        return activeChannel.members.includes(user.id);
      });
    }
    return [];
  }

  function createAvatar(memberId) {
    return (
      <StyledBadge
        overlap='circle'
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        variant={app.usersOnline.includes(memberId) ? 'dot' : 'standard'}
      >
        <Box>
          <PersonIcon
            style={{ fontSize: 30, background: 'cadetblue' }}
            alt='icon-user'
          />
        </Box>
      </StyledBadge>
    );
  }

  return <>{members}</>;
}
