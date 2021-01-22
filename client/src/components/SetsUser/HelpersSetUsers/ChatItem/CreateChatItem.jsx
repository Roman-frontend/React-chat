import React, { useEffect, useCallback, useRef, useState } from 'react';
import { STORAGE_NAME } from '../../../../redux/types';
import { useDispatch, useSelector } from 'react-redux';
import { connect } from 'react-redux';
import { useAuth } from '../../../../hooks/auth.hook.js';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Button } from '@material-ui/core';
//import Button from '@material-ui/core/Button';
import { ACTIVE_CHAT_ID } from '../../../../redux/types.js';
import {
  removeChannel,
  removeDirectMessages,
} from '../../../../redux/actions/actions';
import { createDirectMsgName, createChannelName } from './ChatName.jsx';
import {
  styles,
  styleActiveLink,
  styleIsNotActiveLink,
} from './ChatStyles.jsx';

export const CreateLists = withStyles(styles)((props) => {
  const { arrElements, listName, classes } = props;
  const { changeStorage } = useAuth();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userData);
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
      const storage = JSON.parse(sessionStorage.getItem(STORAGE_NAME));
      const isStorage = storage ? storage : null;
      setActiveId(isStorage.userData.lastActiveChatId);
    }, 1000);
  }, []);

  function createLink(linkData, listName) {
    const id = linkData._id;
    const name =
      listName === 'directMessages'
        ? createDirectMsgName(linkData.invited.name)
        : createChannelName(linkData.isPrivate, linkData);

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

  function showMore(id, typeChat) {
    if (typeChat === 'directMessages' && token) {
      const filteredUserDirectMessages = userData.directMessages.filter(
        (directMessageId) => {
          return directMessageId !== id;
        }
      );
      const body = { userId, filteredUserDirectMessages };
      dispatch(removeDirectMessages(token, id, { ...body }));
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
        changeStorage({ lastActiveChatId: idActive });
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
