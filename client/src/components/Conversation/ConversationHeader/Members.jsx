import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import { StyledBadge } from './ConversationHeaderStyles';
import { useQuery, useReactiveVar } from '@apollo/client';
import { GET_USERS } from '../../../GraphQLApp/queryes';
import { CHANNELS } from '../../SetsUser/SetsUserGraphQL/queryes';
import {
  activeChatId,
  reactiveOnlineMembers,
} from '../../../GraphQLApp/reactiveVars';

export function Members(props) {
  const { activeChannel, setModalIsShowsMembers } = props;
  const { data: users } = useQuery(GET_USERS);
  const { data: channels } = useQuery(CHANNELS);
  const [iconMembers, setIconMembers] = useState([]);
  const activeChannelId = useReactiveVar(activeChatId).activeChannelId;
  const usersOnline = useReactiveVar(reactiveOnlineMembers);

  useEffect(() => {
    if (users && Array.isArray(users.users) && activeChannel) {
      createAvatars();
    }
  }, [activeChannelId, users, activeChannel, usersOnline, channels]);

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
              <Avatar alt={user.name}>{user.name[0]}</Avatar>
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

  return iconMembers;
}
