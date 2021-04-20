import React, { useState, useEffect } from 'react';
import PersonIcon from '@material-ui/icons/Person';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { StyledBadge } from '../../Conversation/ConversationHeader/ConversationHeaderStyles';
import { useQuery } from '@apollo/client';
import { APP, GET_USERS } from '../../GraphQL/queryes';

export function CreateListMembers(props) {
  const { activeChannel, classes } = props;
  const [members, setMembers] = useState();
  const { data: allUsers } = useQuery(GET_USERS);
  const { data: app } = useQuery(APP);

  useEffect(() => {
    if (allUsers && allUsers.users && allUsers.users[0] && activeChannel) {
      createListMembers();
    }
  }, [app, activeChannel, allUsers]);

  const createListMembers = () => {
    const listMembers = getMembersActiveChannel();
    const readyList = (
      <List dense className={classes.root}>
        {listMembers.map((member) => {
          return (
            <ListItem key={member._id} button>
              <ListItemAvatar>{createAvatar(member._id)}</ListItemAvatar>
              <ListItemText id={member._id} primary={member.email} />
            </ListItem>
          );
        })}
      </List>
    );
    setMembers(readyList);
  };

  function getMembersActiveChannel() {
    let listMembers = [];
    if (activeChannel && allUsers && allUsers.users && allUsers.users[0]) {
      const allUsers = allUsers.users;
      activeChannel.members.forEach((memberId) => {
        const filteredUsers = allUsers.filter(
          (member) => member.id === memberId
        );
        listMembers = listMembers.concat(filteredUsers);
      });
    }

    return listMembers;
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
