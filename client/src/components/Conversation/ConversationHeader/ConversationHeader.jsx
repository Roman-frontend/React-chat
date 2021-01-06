import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
  useRef,
  Suspense,
} from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
//import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
//import Skeleton from '@material-ui/lab/Skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { connect } from 'react-redux';
import { addPeopleToChannel } from '../../../redux/actions/actions.js';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import { ConversationMembers } from '../../Modals/ConversationHeader/ConversationMembers';
import { AddPeopleToChannel } from '../../Modals/AddPeopleToChannel/AddPeopleToChannel';
import imageProfile from '../../../images/Profile.jpg';
import './ConversationHeader.sass';

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: '$ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}))(Badge);

export function ConversationHeader() {
  //const classes = useStyles();
  const dispatch = useDispatch();
  const usersOnline = useSelector((state) => state.usersOnline);
  const users = useSelector((state) => state.users);
  const channels = useSelector((state) => state.channels);
  const userId = useSelector((state) => state.userData._id);
  const token = useSelector((state) => state.token);
  const activeChannelId = useSelector((state) => state.activeChannelId);
  const activeDirectMessageId = useSelector(
    (state) => state.activeDirectMessageId
  );
  const listDirectMessages = useSelector((state) => state.listDirectMessages);
  const [modalIsShowsMembers, setModalIsShowsMembers] = useState(false);
  const [modalAddPeopleIsOpen, setModalAddPeopleIsOpen] = useState(false);
  const chatNameRef = useRef('#general');

  useLayoutEffect(() => {
    console.log(usersOnline);
  }, [usersOnline, activeChannelId]);

  const activeChannel = useMemo(() => {
    if (channels) {
      if (activeChannelId && channels[0]) {
        return channels.filter((channel) => channel._id === activeChannelId)[0];
      } else if (activeDirectMessageId) {
        return null;
      }
    }
  }, [activeChannelId, channels]);

  const createName = useCallback(() => {
    let name = activeChannel ? activeChannel.name : 'general';
    if (activeDirectMessageId && listDirectMessages && listDirectMessages[0]) {
      const activeDirectMessage = listDirectMessages.filter((directMessage) => {
        return directMessage._id === activeDirectMessageId;
      })[0];
      name =
        activeDirectMessage.inviter._id === userId
          ? activeDirectMessage.invited.name
          : activeDirectMessage.inviter.name;
    }

    chatNameRef.current = name;

    return <b className='conversation__name'>✩ {name}</b>;
  }, [activeChannel, activeDirectMessageId]);

  const createMembers = useCallback(() => {
    console.log('createMembers');
    return (
      <div style={{ flexGrow: 1 }}>
        <Grid
          container
          spacing={1}
          style={{ height: '4.3rem', width: '19vw', alignContent: 'center' }}
        >
          <Grid item xs={6} style={{ alignSelf: 'center' }}>
            {createAvatars()}
          </Grid>
          <Grid item xs={5}>
            <GroupAddIcon
              style={{ fontSize: 45, cursor: 'pointer' }}
              onClick={() => openModalAddPeoples()}
            />
          </Grid>
        </Grid>
      </div>
    );
  }, [activeChannel, usersOnline]);

  function createAvatars() {
    let avatars = [];
    if (activeChannel && users) {
      activeChannel.members.forEach((memberId) => {
        users.forEach((user) => {
          if (user._id === memberId) {
            avatars = avatars.concat(
              <StyledBadge
                key={user._id}
                overlap='circle'
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                variant={checkOnline(user._id) ? 'dot' : 'standard'}
              >
                <Avatar alt={user.name} src='/static/images/avatar/2.jpg' />
              </StyledBadge>
            );
          }
        });
      });
      return createAvatar(avatars);
    }
  }

  function createAvatar(avatars) {
    console.log(avatars);
    return (
      <AvatarGroup
        max={3}
        style={{ fontSize: 30, cursor: 'pointer' }}
        onClick={() => setModalIsShowsMembers(true)}
      >
        {avatars}
      </AvatarGroup>
    );
  }

  function checkOnline(memberId) {
    let result = false;
    usersOnline.forEach((chat) => {
      if (
        chat.chatId === activeChannelId &&
        chat.onlineMembers.includes(memberId)
      ) {
        result = true;
      }
    });
    return result;
  }

  function openModalAddPeoples() {
    if (activeChannelId) {
      setModalAddPeopleIsOpen(true);
    }
  }

  function doneInvite(action, invited = []) {
    if (action === 'done' && invited[0]) {
      const arrInvited = invited.map((people) => people._id);
      dispatch(
        addPeopleToChannel(token, { invitedUsers: arrInvited }, activeChannelId)
      );
    }
    setModalAddPeopleIsOpen(false);
  }

  console.log(usersOnline);

  return (
    <div className='conversation__field-name'>
      <Grid container spacing={1} style={{ alignItems: 'center' }}>
        <Grid item xs={9}>
          {createName()}
        </Grid>
        <Grid item xs={2}>
          {createMembers()}
        </Grid>
      </Grid>
      <ConversationMembers
        activeChannel={activeChannel}
        modalIsShowsMembers={modalIsShowsMembers}
        setModalIsShowsMembers={setModalIsShowsMembers}
        checkOnline={checkOnline}
      />
      <AddPeopleToChannel
        chatNameRef={chatNameRef}
        doneInvite={doneInvite}
        modalAddPeopleIsOpen={modalAddPeopleIsOpen}
        setModalAddPeopleIsOpen={setModalAddPeopleIsOpen}
      />
    </div>
  );
}

const mapDispatchToProps = { addPeopleToChannel };

export default connect(null, mapDispatchToProps)(ConversationHeader);
