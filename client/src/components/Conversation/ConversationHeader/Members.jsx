import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Grid from '@material-ui/core/Grid';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import { useSelector } from 'react-redux';
import { StyledBadge } from './ConversationHeaderStyles';

export function Members(props) {
  const {
    activeChannel,
    setModalIsShowsMembers,
    setModalAddPeopleIsOpen,
  } = props;
  const users = useSelector((state) => state.users);
  const activeChannelId = useSelector((state) => state.activeChannelId);
  const chatsOnline = useSelector((state) => state.usersOnline);
  const [iconMembers, setIconMembers] = useState([]);

  useEffect(() => {
    if (users && activeChannel) createAvatars();
  }, [chatsOnline, users, activeChannel]);

  function openModalAddPeoples() {
    if (activeChannelId) {
      setModalAddPeopleIsOpen(true);
    }
  }

  const createAvatars = () => {
    let avatars = [];
    activeChannel.members.forEach((memberId) => {
      users.forEach((user) => {
        if (user._id === memberId) {
          avatars = avatars.concat(
            <StyledBadge
              key={user._id}
              style={{ border: 0 }}
              overlap='circle'
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant={chatsOnline.includes(user._id) ? 'dot' : 'standard'}
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
        <Grid item xs={6} style={{ alignSelf: 'center' }}>
          {iconMembers}
        </Grid>
        <Grid item xs={5} style={{ textAlign: 'center' }}>
          <GroupAddIcon
            style={{ fontSize: 45, cursor: 'pointer' }}
            onClick={() => openModalAddPeoples()}
          />
        </Grid>
      </Grid>
    </div>
  );
}
