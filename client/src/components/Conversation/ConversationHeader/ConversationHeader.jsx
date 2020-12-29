import React, {
  useState,
  useEffect,
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
  const channels = useSelector((state) => state.channels);
  const userId = useSelector((state) => state.userData._id);
  const token = useSelector((state) => state.token);
  const activeChannelId = useSelector((state) => state.activeChannelId);
  const activeDirectMessageId = useSelector(
    (state) => state.activeDirectMessageId
  );
  const listDirectMessages = useSelector((state) => state.listDirectMessages);
  const [invited, setInvited] = useState([]);
  const [modalIsShowsMembers, setModalIsShowsMembers] = useState(false);
  const [modalAddPeopleIsOpen, setModalAddPeopleIsOpen] = useState(false);
  const chatNameRef = useRef('#general');

  /* useEffect(() => {
    async function getPeoples() {
      await dispatch(getUsers(token, userId));
    }

    if (userId) getPeoples();
  }, [userId]); */

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
    return (
      <div style={{ flexGrow: 1 }}>
        <Grid
          container
          spacing={1}
          style={{ height: '4.3rem', alignContent: 'center' }}
        >
          <Grid item xs={6} style={{ alignSelf: 'center' }}>
            <AvatarGroup
              max={2}
              style={{ fontSize: 30, cursor: 'pointer' }}
              onClick={() => setModalIsShowsMembers(true)}
            >
              <StyledBadge
                overlap='circle'
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                variant='dot'
              >
                <Avatar alt='Remy Sharp' src={imageProfile} />
              </StyledBadge>
              <Avatar alt='Travis Howard' src='/static/images/avatar/2.jpg' />
            </AvatarGroup>
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
  }, [activeChannel]);

  function openModalAddPeoples() {
    if (activeChannelId) {
      setModalAddPeopleIsOpen(true);
    }
  }

  function doneInvite(action) {
    if (action === 'invite') {
      console.log(token, invited[0]._id, activeChannelId);
      dispatch(addPeopleToChannel(token, invited[0]._id, activeChannelId));
    }
    setInvited([]);
    setModalAddPeopleIsOpen(false);
  }

  console.log(chatNameRef.current);

  return (
    <div className='conversation__field-name'>
      <Grid container spacing={1} style={{ alignItems: 'center' }}>
        <Grid item xs={10}>
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
      />
      <AddPeopleToChannel
        chatNameRef={chatNameRef}
        doneInvite={doneInvite}
        invited={invited}
        setInvited={setInvited}
        modalAddPeopleIsOpen={modalAddPeopleIsOpen}
        setModalAddPeopleIsOpen={setModalAddPeopleIsOpen}
      />
    </div>
  );
}

const mapDispatchToProps = { addPeopleToChannel };

export default connect(null, mapDispatchToProps)(ConversationHeader);
