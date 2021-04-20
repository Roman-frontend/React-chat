import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Grid from '@material-ui/core/Grid';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import { StyledBadge } from './ConversationHeaderStyles';
import { useQuery } from '@apollo/client';
import { GET_USERS, APP } from '../../GraphQL/queryes';

export function Members(props) {
  const {
    activeChannel,
    setModalIsShowsMembers,
    setModalAddPeopleIsOpen,
  } = props;
  const { data: users } = useQuery(GET_USERS);
  const { data: app } = useQuery(APP);
  const [iconMembers, setIconMembers] = useState([]);

  useEffect(() => {
    if (users && users.users && activeChannel) createAvatars();
  }, [app, users, activeChannel]);

  function openModalAddPeoples() {
    if (app.activeChannelId) {
      setModalAddPeopleIsOpen(true);
    }
  }

  const createAvatars = () => {
    let avatars = [];
    activeChannel.members.forEach((memberId) => {
      users.users.forEach((user) => {
        if (user._id === memberId) {
          avatars = avatars.concat(
            <StyledBadge
              key={user._id}
              style={{ border: 0 }}
              overlap='circle'
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant={app.usersOnline.includes(user._id) ? 'dot' : 'standard'}
            >
              <Avatar alt={user.name} src='/static/images/avatar/2.jpg' />
            </StyledBadge>
          );
        }
      });
    });
    console.log(avatars);
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
        style={{ height: '4.3rem', width: '19vw', alignContent: 'center' }}
      >
        <Grid
          item
          xs={app && app.activeChannelId ? 6 : 11}
          style={{ alignSelf: 'center' }}
        >
          {iconMembers}
        </Grid>
        {app && app.activeChannelId && (
          <Grid item xs={5} style={{ textAlign: 'center' }}>
            <GroupAddIcon
              style={{ fontSize: 45, cursor: 'pointer' }}
              onClick={() => openModalAddPeoples()}
            />
          </Grid>
        )}
      </Grid>
    </div>
  );
}
