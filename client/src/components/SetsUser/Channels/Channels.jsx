import React, { useEffect, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DrawTitles } from '../DrawTitles.jsx';
import { AddChannel } from '../../Modals/AddChannel/AddChannel';
import CreateLists from '../HelpersSetUsers/ChatItem/CreateChatItem';
import Button from '@material-ui/core/Button';
import { colors } from '@material-ui/core';
import { useQuery } from '@apollo/client';
import { APP, CHANNELS, GET_DIRECT_MESSAGES } from '../../GraphQL/queryes';
import {
  reactiveActiveChannelId,
  reactiveActiveDirrectMessageId,
} from '../../GraphQL/reactiveVariables';

export function Channels(props) {
  const { t } = useTranslation();
  const { data: activeChat } = useQuery(APP);
  const { data: allChannels } = useQuery(CHANNELS);
  const { data: listDirectMessages } = useQuery(GET_DIRECT_MESSAGES);
  const [listChannelsIsOpen, setListChannelsIsOpen] = useState(true);
  const [modalAddChannelIsOpen, setModalAddChannelIsOpen] = useState(false);

  useEffect(() => {
    if (activeChat && activeChat.activeChannelId) {
      reactiveActiveChannelId(activeChat.activeChannelId);
      reactiveActiveDirrectMessageId(null);
    } else if (activeChat && activeChat.activeDirectMessageId) {
      reactiveActiveChannelId(null);
      reactiveActiveDirrectMessageId(activeChat.activeDirectMessageId);
    } else if (
      allChannels &&
      allChannels.userChannels &&
      allChannels.userChannels[0]
    ) {
      reactiveActiveChannelId(allChannels.userChannels[0].id);
      reactiveActiveDirrectMessageId(null);
    } else if (
      listDirectMessages &&
      listDirectMessages.directMessages &&
      listDirectMessages.directMessages[0]
    ) {
      reactiveActiveChannelId(null);
      reactiveActiveDirrectMessageId(listDirectMessages.directMessages[0].id);
    }
  }, [allChannels, listDirectMessages]);

  function createLinksChannels(allChannels) {
    if (
      allChannels &&
      allChannels.userChannels &&
      allChannels.userChannels[0]
    ) {
      return <CreateLists reqRowElements={allChannels.userChannels} />;
    }
  }

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
          + Add Channel
        </Button>
        <AddChannel
          modalAddChannelIsOpen={modalAddChannelIsOpen}
          setModalAddChannelIsOpen={setModalAddChannelIsOpen}
        />
      </div>
    </>
  );
}
