import React, { useEffect, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  GET_CHANNELS,
  ACTIVE_CHAT_ID,
  STORAGE_NAME,
} from '../../../redux/types';
import { useDispatch, useSelector } from 'react-redux';
import { connect } from 'react-redux';
import { getChannels } from '../../../redux/actions/actions.js';
import { useAuth } from '../../../hooks/auth.hook.js';
import { DrawTitles } from '../DrawTitles.jsx';
import { AddChannel } from '../../Modals/AddChannel/AddChannel';
import CreateLists from '../HelpersSetUsers/ChatItem/CreateChatItem';
import Button from '@material-ui/core/Button';
import { colors } from '@material-ui/core';

export function Channels(props) {
  const { resSuspense } = props;
  const { t } = useTranslation();
  const resourseChannels = resSuspense.channels.read();
  const dispatch = useDispatch();
  const allChannels = useSelector((state) => state.channels);
  const listDirectMessages = useSelector((state) => state.listDirectMessages);
  const activeChannelId = useSelector((state) => state.activeChannelId);
  const activeDirectMessageId = useSelector(
    (state) => state.activeDirectMessageId
  );
  const [listChannelsIsOpen, setListChannelsIsOpen] = useState(true);
  const [modalAddChannelIsOpen, setModalAddChannelIsOpen] = useState(false);
  const { changeStorage } = useAuth();

  useEffect(() => {
    function defineActiveChat() {
      const sessionStorageData = JSON.parse(
        sessionStorage.getItem(STORAGE_NAME)
      );
      const storageData = sessionStorageData
        ? sessionStorageData.userData
        : null;
      if (activeChannelId) {
        return { activeChannelId };
      } else if (activeDirectMessageId) {
        return { activeDirectMessageId };
      } else if (storageData && storageData.lastActiveChatId) {
        if (storageData.channels) {
          const channelHasLast = storageData.channels.includes(
            storageData.lastActiveChatId
          );
          if (channelHasLast) {
            return { activeChannelId: storageData.lastActiveChatId };
          } else if (storageData.directMessages) {
            const listDrMsgHasLast = storageData.directMessages.includes(
              storageData.lastActiveChatId
            );
            if (listDrMsgHasLast) {
              return { activeDirectMessageId: storageData.lastActiveChatId };
            }
          }
        }
      } else if (allChannels && allChannels[0]) {
        return { activeChannelId: allChannels[0]._id };
      } else if (listDirectMessages && listDirectMessages[0]) {
        return {
          activeDirectMessageId: listDirectMessages[0]._id,
        };
      } else {
        return null;
      }
    }

    if (allChannels) {
      const activeChat = defineActiveChat();
      dispatch({ type: ACTIVE_CHAT_ID, payload: activeChat });
    }
  }, [allChannels]);

  useEffect(() => {
    if (resourseChannels) {
      dispatch({ type: GET_CHANNELS, payload: resourseChannels });
    }
  }, [resourseChannels]);

  useEffect(() => {
    if (allChannels && allChannels[0]) {
      const sessionStorageData = JSON.parse(
        sessionStorage.getItem(STORAGE_NAME)
      );
      const storageData = sessionStorageData ? sessionStorageData : null;
      const idChannels = allChannels.map((channel) => channel._id);
      if (idChannels !== storageData.userData.channels) {
        changeStorage({ channels: idChannels });
      }
    }
  }, [allChannels]);

  const createLinksChannels = useCallback(
    (allChannels) => {
      if (allChannels && allChannels[0]) {
        return <CreateLists reqRowElements={allChannels} />;
      }
    },
    [allChannels]
  );

  return (
    <>
      <div>
        <DrawTitles
          name={t('description.channelTitle')}
          divClass={'left-bar__channels'}
          stateShowing={listChannelsIsOpen}
          seterStateShowing={setListChannelsIsOpen}
          setModalAdd={setModalAddChannelIsOpen}
        />
      </div>
      <div
        className='user-sets__users'
        style={{ display: listChannelsIsOpen ? 'block' : 'none' }}
      >
        {createLinksChannels(allChannels)}
        <Button
          variant='contained'
          color='primary'
          size='small'
          style={{ background: colors.indigo[500], width: '100%' }}
          onClick={() => setModalAddChannelIsOpen(true)}
        >
          + Add channel
        </Button>
        <AddChannel
          modalAddChannelIsOpen={modalAddChannelIsOpen}
          setModalAddChannelIsOpen={setModalAddChannelIsOpen}
        />
      </div>
    </>
  );
}

const mapDispatchToProps = { getChannels };

export default connect(null, mapDispatchToProps)(Channels);
