import React, { useState, useEffect, useCallback, useRef } from 'react';
import PersonIcon from '@material-ui/icons/Person';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Grid from '@material-ui/core/Grid';
import { useTranslation } from 'react-i18next';
import { ACTIVE_CHAT_ID } from '../../redux/types.js';
import { useDispatch, useSelector } from 'react-redux';
import { connect } from 'react-redux';
import { useAuth } from '../../hooks/auth.hook.js';
import { DrawTitles } from './DrawTitles.jsx';
import { Channels } from './Channels/Channels.jsx';
import { DirectMessages } from './DirectMessages/DirectMessages';
import './user-sets.sass';

export function SetsUser(props) {
  const { t } = useTranslation();
  const { socket } = props;
  const { changeStorageUserDataActiveChat } = useAuth();
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.channels);
  const allUsers = useSelector((state) => state.users);
  const activeChannelId = useSelector((state) => state.activeChannelId);
  const activeDirectMessageId = useSelector(
    (state) => state.activeDirectMessageId
  );
  const listDirectMessages = useSelector((state) => state.listDirectMessages);

  const [modalAddChannelIsOpen, setModalAddChannelIsOpen] = useState(false);
  const [modalAddPeopleIsOpen, setModalAddPeopleIsOpen] = useState(false);
  const [listChannelsIsOpen, setListChannelsIsOpen] = useState(true);
  const [listMembersIsOpen, setListMembersIsOpen] = useState(true);
  const refIdPrevChannel = useRef(activeChannelId);
  const refUpdatedChannels = useRef(null);

  useEffect(() => {
    if (channels) {
      refUpdatedChannels.current = channels;
    }
  }, [channels]);

  useEffect(() => {
    setTimeout(() => {
      const storageData = JSON.parse(localStorage.getItem('userData'));
      markActiveLinkChannel(storageData.lastActiveChatId);
    }, 1000);
  }, []);

  const createLists = useCallback(
    (arrElements, listName) => {
      let allDirectMessages = [
        <div key='1' id='1' className='user-sets__channel'>
          <p>general</p>
        </div>,
      ];
      arrElements.forEach((element) =>
        allDirectMessages.push(createLink(element, listName))
      );

      return allDirectMessages;
    },
    [listDirectMessages, allUsers]
  );

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
        <Grid item xs={10} style={{}}>
          {nameChannel}
        </Grid>
        <Grid item xs={2}>
          <DeleteForeverIcon
            onClick={() =>
              socket.send(JSON.stringify({ room: channel._id, meta: 'leave' }))
            }
          />
        </Grid>
      </Grid>
    );
  }

  const toActive = useCallback(
    async (idActive) => {
      openSocketRoom(idActive);
      if (refUpdatedChannels.current) {
        changeStorageUserDataActiveChat({ lastActiveChatId: idActive });
        changeActiveChatId(idActive);
        markActiveLinkChannel(idActive);
      }
    },
    [activeChannelId, activeDirectMessageId]
  );

  function openSocketRoom(idActive) {
    const prevId = refIdPrevChannel.current
      ? refIdPrevChannel.current
      : activeChannelId
      ? activeChannelId
      : activeDirectMessageId;
    if (prevId !== idActive) {
      socket.send(JSON.stringify({ room: prevId, meta: 'leave' }));
      refIdPrevChannel.current = idActive;
      socket.send(JSON.stringify({ room: idActive, meta: 'join' }));
    }
  }

  const changeActiveChatId = useCallback(
    (idActive) => {
      if (
        (activeChannelId || activeDirectMessageId) &&
        refUpdatedChannels.current
      ) {
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

  return (
    <div className='main-font left-block'>
      <div>
        <DrawTitles
          name={t('description.channelTitle')}
          divClass={'left-bar__channels'}
          classPlus={'left-bar__first-plus'}
          stateShowing={listChannelsIsOpen}
          seterStateShowing={setListChannelsIsOpen}
          setModalAdd={setModalAddChannelIsOpen}
        />
      </div>
      <Channels
        listChannelsIsOpen={listChannelsIsOpen}
        modalAddChannelIsOpen={modalAddChannelIsOpen}
        setModalAddChannelIsOpen={setModalAddChannelIsOpen}
        createLists={createLists}
      />
      <div>
        <DrawTitles
          name={t('description.dirrectMessageTitle')}
          divClass={null}
          classPlus={'left-bar__second-plus'}
          stateShowing={listMembersIsOpen}
          seterStateShowing={setListMembersIsOpen}
          setModalAdd={setModalAddPeopleIsOpen}
        />
      </div>
      <DirectMessages
        listMembersIsOpen={listMembersIsOpen}
        modalAddPeopleIsOpen={modalAddPeopleIsOpen}
        setModalAddPeopleIsOpen={setModalAddPeopleIsOpen}
        createLists={createLists}
      />
    </div>
  );
}

export default connect(null, null)(SetsUser);
