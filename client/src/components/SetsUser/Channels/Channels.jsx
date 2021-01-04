import React, { useEffect, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useChatContext from '../../../Context/ChatContext.js';
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
import CreateLists from '../HelpersSetUsers/CreateChatItem';
import Button from '@material-ui/core/Button';

export function Channels(props) {
  const { t } = useTranslation();
  const { resChannels } = useChatContext();
  const { socket } = props;
  const resourseChannels = resChannels.channels.read();
  const dispatch = useDispatch();
  const allChannels = useSelector((state) => state.channels);
  const listDirectMessages = useSelector((state) => state.listDirectMessages);
  const token = useSelector((state) => state.token);
  const userData = useSelector((state) => state.userData);
  const activeChannelId = useSelector((state) => state.activeChannelId);
  const activeDirectMessageId = useSelector(
    (state) => state.activeDirectMessageId
  );
  const [listChannelsIsOpen, setListChannelsIsOpen] = useState(true);
  const [modalAddChannelIsOpen, setModalAddChannelIsOpen] = useState(false);
  const { changeStorageUserDataChannels } = useAuth();

  useEffect(() => {
    /* function getOnlineMembers(idActive) {
      socket.clientPromise
        .then((wsClient) => {
          wsClient.send(
            JSON.stringify({ room: idActive, meta: 'visit' })
          );
          console.log('sended');
        })
        .catch((error) => console.log(error));
    } */

    function defineActiveChat() {
      const sessionStorageData = JSON.parse(
        sessionStorage.getItem(STORAGE_NAME)
      );
      const localStorageData = JSON.parse(localStorage.getItem(STORAGE_NAME));
      const storageData = sessionStorageData
        ? sessionStorageData.userData
        : localStorageData
        ? localStorageData.userData
        : null;
      if (activeChannelId) {
        return { activeChannelId };
      } else if (activeDirectMessageId) {
        return { activeDirectMessageId };
      } else if (storageData.lastActiveChatId) {
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

    if (resourseChannels) {
      const activeChat = defineActiveChat();
      const idActive = !activeChat
        ? null
        : activeChat.activeChannelId
        ? activeChat.activeChannelId
        : activeChat.activeDirectMessageId;

      dispatch({ type: GET_CHANNELS, payload: resourseChannels });
      dispatch({ type: ACTIVE_CHAT_ID, payload: activeChat });
      //if (idActive) getOnlineMembers(idActive);
    }
  }, [resourseChannels]);

  useEffect(() => {
    if (allChannels && allChannels[0]) {
      const sessionStorageData = JSON.parse(
        sessionStorage.getItem(STORAGE_NAME)
      );
      const localStorageData = JSON.parse(localStorage.getItem(STORAGE_NAME));
      const storageData = sessionStorageData
        ? sessionStorageData
        : localStorageData
        ? localStorageData
        : null;
      const idChannels = allChannels.map((channel) => channel._id);
      if (idChannels !== storageData.userData.channels) {
        changeStorageUserDataChannels({ channels: idChannels });
      }
    }
  }, [allChannels]);

  const createLinksChannels = useCallback(
    (allChannels) => {
      if (allChannels && allChannels[0]) {
        return <CreateLists arrElements={allChannels} socket={socket} />;
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
          classPlus={'left-bar__first-plus'}
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
          className='user-sets__channel'
          variant='outlined'
          color='primary'
          size='small'
          style={{ background: 'white' }}
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
