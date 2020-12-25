import React, { useEffect, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useChatContext from '../../../Context/ChatContext.js';
import { GET_CHANNELS, ACTIVE_CHAT_ID } from '../../../redux/types';
import { useDispatch, useSelector } from 'react-redux';
import { connect } from 'react-redux';
import { getChannels } from '../../../redux/actions/actions.js';
import Modal from 'react-modal';
import { useAuth } from '../../../hooks/auth.hook.js';
import { DrawTitles } from '../DrawTitles.jsx';
import { AddChannel } from '../../Modals/AddChannel/AddChannel';
import CreateLists from '../HelpersSetUsers/CreateChatItem';
import './channels.sass';
Modal.setAppElement('#root');

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
    function defineActiveChat() {
      const storageData = JSON.parse(localStorage.getItem('userData')).userData;
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
      } else if (allChannels) {
        return { activeChannelId: allChannels[0]._id };
      } else if (listDirectMessages && listDirectMessages[0]) {
        console.log(listDirectMessages);
        return {
          activeDirectMessageId: listDirectMessages[0]._id,
        };
      } else {
        return null;
      }
    }

    if (resourseChannels) {
      /* startedChannel =
        storageData.lastActiveChatId &&
        storageData.channels.includes(storageData.lastActiveChatId)
          ? { activeChannelId: storageData.lastActiveChatId }
          : startedChannel;

      startedChannel =
        storageData.lastActiveChatId &&
        storageData.listDirectMessages.includes(storageData.lastActiveChatId)
          ? { activeChannelId: storageData.lastActiveChatId }
          : startedChannel; */

      //startedChannel = activeChannelId ? { activeChannelId } : startedChannel;
      const activeChat = defineActiveChat();
      console.log(activeChat);
      dispatch({ type: GET_CHANNELS, payload: resourseChannels });
      dispatch({ type: ACTIVE_CHAT_ID, payload: activeChat });
    }
  }, [resourseChannels]);

  useEffect(() => {
    if (allChannels) {
      const storageData = JSON.parse(localStorage.getItem('userData'));
      const idChannels = allChannels.map((channel) => channel._id);
      if (idChannels !== storageData.userData.channels) {
        changeStorageUserDataChannels({ channels: idChannels });
      }
    }
  }, [allChannels]);

  const createLinksChannels = useCallback(() => {
    if (allChannels) {
      return <CreateLists arrElements={allChannels} socket={socket} />;
    }
  }, [allChannels]);

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
        <div className='user-sets__channel user-sets__channel_add'>
          <p
            className='main-font'
            onClick={() => setModalAddChannelIsOpen(true)}
          >
            + Add channel
          </p>
        </div>
        <Modal
          isOpen={modalAddChannelIsOpen}
          onRequestClose={() => setModalAddChannelIsOpen(false)}
          className={'modal-content'}
          overlayClassName={'modal-overlay'}
        >
          <AddChannel setModalAddChannelIsOpen={setModalAddChannelIsOpen} />
        </Modal>
      </div>
    </>
  );
}

const mapDispatchToProps = { getChannels };

export default connect(null, mapDispatchToProps)(Channels);
