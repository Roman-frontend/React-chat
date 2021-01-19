import React, { useEffect, useCallback, useRef, useState } from 'react';
import { STORAGE_NAME } from '../../../redux/types';
import { useDispatch, useSelector } from 'react-redux';
import { connect } from 'react-redux';
import { useAuth } from '../../../hooks/auth.hook.js';
import { withStyles } from '@material-ui/core/styles';
import PersonIcon from '@material-ui/icons/Person';
import { Grid, Button } from '@material-ui/core';
//import Button from '@material-ui/core/Button';
import { colors } from '@material-ui/core';
import { ACTIVE_CHAT_ID } from '../../../redux/types.js';
import {
  removeChannel,
  removeDirectMessages,
} from '../../../redux/actions/actions';

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    flexGrow: 1,
    fontSize: '4vh',
    textAlign: 'right',
    margin: 0,
  },
  buttonRoot: {
    padding: 0,
    width: '17px',
    height: '17px',
    minWidth: 0,
  },
});

export const CreateLists = withStyles(styles)((props) => {
  const { arrElements, listName, classes } = props;
  const { changeStorageUserDataActiveChat } = useAuth();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.userData._id);
  const userChannels = useSelector((state) => state.userData.channels);
  const token = useSelector((state) => state.token);
  const activeChannelId = useSelector((state) => state.activeChannelId);
  const channels = useSelector((state) => state.channels);
  const activeDirectMessageId = useSelector(
    (state) => state.activeDirectMessageId
  );
  const refUpdatedChannels = useRef(null);
  const [focusedId, setFocusedId] = useState(false);
  const [activeId, setActiveId] = useState(false);

  useEffect(() => {
    if (channels) {
      refUpdatedChannels.current = channels;
    }
  }, [channels]);

  useEffect(() => {
    setTimeout(() => {
      const sessionStorageData = JSON.parse(
        sessionStorage.getItem(STORAGE_NAME)
      );
      const storageData = sessionStorageData ? sessionStorageData : null;
      setActiveId(storageData.userData.lastActiveChatId);
    }, 1000);
  }, []);

  function createLink(linkData, listName) {
    const id = linkData._id;
    const name =
      listName === 'directMessages'
        ? createDirectMsgName(linkData.invited.name)
        : createChannelName(linkData.isPrivate, linkData);
    const styleIsNotActiveLink = {
      borderRadius: '0.4rem',
      background: '#115293',
      padding: '0.5rem',
      margin: '0rem 1.5rem',
    };
    const styleActiveLink = {
      padding: '0.5rem 2rem',
      background: colors.indigo[900],
    };

    return (
      <div
        key={id}
        id={id}
        onMouseEnter={() => setFocusedId(id)}
        onMouseLeave={() => setFocusedId(false)}
        onClick={() => setActiveId(id)}
        className='main-font chatHover'
        style={activeId === id ? styleActiveLink : styleIsNotActiveLink}
      >
        <Grid
          container
          style={{
            alignItems: 'center',
          }}
        >
          <Grid item xs={10} onClick={() => toActive(id)}>
            {name}
          </Grid>
          <Grid
            item
            xs={2}
            style={{ display: focusedId === id ? 'flex' : 'none' }}
          >
            <Button
              variant='outlined'
              color='primary'
              size='small'
              style={{ background: 'white' }}
              classes={{ root: classes.buttonRoot }}
              onClick={() => showMore(id, listName)}
            >
              X
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }

  function createDirectMsgName(name) {
    return (
      <Grid container style={{ alignItems: 'center' }}>
        <Grid item xs={2}>
          <PersonIcon
            style={{ background: 'cadetblue', borderRadius: '0.4rem' }}
          />
        </Grid>
        <Grid item xs={10}>
          {name}
        </Grid>
      </Grid>
    );
  }

  function createChannelName(isPrivate, channel) {
    const nameChannel = isPrivate ? (
      <p className='main-font'>&#128274;{channel.name}</p>
    ) : (
      <p className='main-font'>{`#${channel.name}`}</p>
    );

    return (
      <Grid container className='left-bar__title-name'>
        <Grid item xs={12}>
          {nameChannel}
        </Grid>
      </Grid>
    );
  }

  function showMore(id, typeChat) {
    if (typeChat === 'directMessages' && token) {
      dispatch(removeDirectMessages(token, id, { userId }));
    } else if (token && userId && channels && userChannels) {
      const channel = channels.filter((channel) => channel._id === id)[0];
      const filteredChannelMembers = channel.members.filter(
        (id) => id !== userId
      );
      const filteredUserChannels = userChannels.filter(
        (channelId) => channelId !== id
      );
      const body = { userId, filteredChannelMembers, filteredUserChannels };
      dispatch(removeChannel(token, id, { ...body }));
    }
    toActive(channels[0]._id);
  }

  const toActive = useCallback(
    async (idActive) => {
      if (refUpdatedChannels.current) {
        changeStorageUserDataActiveChat({ lastActiveChatId: idActive });
        changeActiveChatId(idActive);
      }
    },
    [activeChannelId, activeDirectMessageId]
  );

  const changeActiveChatId = useCallback(
    (idActive) => {
      if (channels && refUpdatedChannels.current) {
        const objectChatNameAndId = createPayloadForChange(idActive);
        dispatch({ type: ACTIVE_CHAT_ID, payload: objectChatNameAndId });
      }
    },
    [channels, activeDirectMessageId, activeChannelId]
  );

  function createPayloadForChange(idActive) {
    const channelActiveId = refUpdatedChannels.current.filter(
      (channel) => channel._id === idActive
    )[0];
    return channelActiveId
      ? { activeChannelId: channelActiveId._id, activeDirectMessageId: null }
      : { activeChannelId: null, activeDirectMessageId: idActive };
  }

  let allDirectMessages = [];
  arrElements.forEach((element) =>
    allDirectMessages.push(createLink(element, listName))
  );

  return allDirectMessages;
});

const mapDispatchToProps = { removeChannel, removeDirectMessages };

export default connect(null, mapDispatchToProps)(CreateLists);
