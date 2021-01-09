import React, { useEffect, useCallback, useRef } from 'react';
import { STORAGE_NAME } from '../../../redux/types';
import { useDispatch, useSelector } from 'react-redux';
import { connect } from 'react-redux';
import { useAuth } from '../../../hooks/auth.hook.js';
import PersonIcon from '@material-ui/icons/Person';
import Grid from '@material-ui/core/Grid';
import { ACTIVE_CHAT_ID } from '../../../redux/types.js';

export function CreateLists(props) {
  const { arrElements, listName } = props;
  const { changeStorageUserDataActiveChat } = useAuth();
  const dispatch = useDispatch();
  const activeChannelId = useSelector((state) => state.activeChannelId);
  const channels = useSelector((state) => state.channels);
  const activeDirectMessageId = useSelector(
    (state) => state.activeDirectMessageId
  );
  const refUpdatedChannels = useRef(null);

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
      const localStorageData = JSON.parse(localStorage.getItem(STORAGE_NAME));
      const storageData = sessionStorageData
        ? sessionStorageData
        : localStorageData
        ? localStorageData
        : null;
      markActiveLinkChannel(storageData.userData.lastActiveChatId);
    }, 1000);
  }, []);

  function createLink(linkData, listName) {
    const name =
      listName === 'directMessages'
        ? createDirectMsgName(linkData.invited.name)
        : createChannelName(linkData.isPrivate, linkData);

    return (
      <div
        key={linkData._id}
        id={linkData._id}
        className='main-font user-sets__channel'
        onClick={() => toActive(linkData._id)}
      >
        {name}
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

  const toActive = useCallback(
    async (idActive) => {
      if (refUpdatedChannels.current) {
        changeStorageUserDataActiveChat({ lastActiveChatId: idActive });
        changeActiveChatId(idActive);
        markActiveLinkChannel(idActive);
        //getOnlineMembers(idActive);
      }
    },
    [activeChannelId, activeDirectMessageId]
  );

  const changeActiveChatId = useCallback(
    (idActive) => {
      if (channels && refUpdatedChannels.current) {
        const objectChatNameAndId = createPayloadForChange(idActive);
        dispatch({
          type: ACTIVE_CHAT_ID,
          payload: objectChatNameAndId,
        });
      }
    },
    [channels, activeDirectMessageId, activeChannelId]
  );

  function createPayloadForChange(idActive) {
    const channelActiveId = refUpdatedChannels.current.filter(
      (channel) => channel._id === idActive
    )[0];
    return channelActiveId
      ? {
          activeChannelId: channelActiveId._id,
          activeDirectMessageId: null,
        }
      : { activeChannelId: null, activeDirectMessageId: idActive };
  }

  function markActiveLinkChannel(idActiveChat) {
    const oldMarkChannel = document.querySelector('.user-sets__channel_active');
    const channelForActive = document.getElementById(idActiveChat);

    if (oldMarkChannel && channelForActive) {
      oldMarkChannel.classList.remove('user-sets__channel_active');
      channelForActive.classList.add('user-sets__channel_active');
    } else if (channelForActive) {
      channelForActive.classList.add('user-sets__channel_active');
    }
  }

  let allDirectMessages = [
    <div key='1' id='1' className='user-sets__channel'>
      <p>general</p>
    </div>,
  ];

  arrElements.forEach((element) =>
    allDirectMessages.push(createLink(element, listName))
  );

  return allDirectMessages;
}

export default connect(null, null)(CreateLists);
