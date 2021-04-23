import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Grid from '@material-ui/core/Grid';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import { StyledBadge } from './ConversationHeaderStyles';
import { useQuery, useReactiveVar } from '@apollo/client';
import { GET_USERS } from '../../../GraphQLApp/queryes';
import {
  activeChatId,
  reactiveOnlineMembers,
} from '../../../GraphQLApp/reactiveVariables';

export function Members(props) {
  const {
    activeChannel,
    setModalIsShowsMembers,
    setModalAddPeopleIsOpen,
  } = props;
  const { data: users } = useQuery(GET_USERS);
  const [iconMembers, setIconMembers] = useState([]);
  const activeChannelId = useReactiveVar(activeChatId).activeChannelId;
  const usersOnline = useReactiveVar(reactiveOnlineMembers);

  useEffect(() => {
    if (users && Array.isArray(users.users) && activeChannel) {
      createAvatars();
    }
  }, [activeChannelId, users, activeChannel, usersOnline]);

  const createAvatars = () => {
    let avatars = [];
    activeChannel.members.forEach((memberId) => {
      users.users.forEach((user) => {
        if (user.id === memberId && usersOnline) {
          avatars = avatars.concat(
            <StyledBadge
              key={user.id}
              style={{ border: 0 }}
              overlap='circle'
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant={usersOnline.includes(user.id) ? 'dot' : 'standard'}
            >
              <Avatar alt={user.name} src='/static/images/avatar/2.jpg' />
            </StyledBadge>
          );
        }
      });
    });
    const readyIcons = createAvatar(avatars);
    setIconMembers(readyIcons);
  };

  function createAvatar(avatars) {
    return (
      <AvatarGroup
        max={3}
        style={{ fontSize: 30, cursor: 'pointer', justifyContent: 'flex-end' }}
        onClick={() => setModalIsShowsMembers(true)}
      >
        {avatars}
      </AvatarGroup>
    );
  }

  return (
    <div style={{ flexGrow: 1 }}>
      <Grid
        container
        spacing={1}
        style={{ width: '19vw', alignContent: 'center' }}
      >
        <Grid
          item
          xs={activeChannelId ? 6 : 11}
          style={{ alignSelf: 'center' }}
        >
          {iconMembers}
        </Grid>
        <Grid item xs={5} style={{ textAlign: 'center' }}>
          <GroupAddIcon
            style={{ fontSize: 45, cursor: 'pointer' }}
            onClick={() => activeChannelId && setModalAddPeopleIsOpen(true)}
          />
        </Grid>
      </Grid>
    </div>
  );
}
