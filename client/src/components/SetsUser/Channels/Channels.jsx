import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DrawTitles } from '../DrawTitles.jsx';
import { AddChannel } from '../../Modals/AddChannel/AddChannel';
import { CreateChannels } from '../HelpersSetUsers/ChatItem/CreateChatItem';
import Button from '@material-ui/core/Button';
import { colors } from '@material-ui/core';
import { useQuery, useReactiveVar } from '@apollo/client';
import {
  CHANNELS,
  GET_DIRECT_MESSAGES,
} from '../../SetsUser/SetsUserGraphQL/queryes';
import {
  activeChatId,
  reactiveVarId,
  reactiveVarToken,
} from '../../../GraphQLApp/reactiveVariables';

export function Channels(props) {
  const { t } = useTranslation();
  const { data: allChannels } = useQuery(CHANNELS);
  const { data: listDirectMessages } = useQuery(GET_DIRECT_MESSAGES);
  const authId = useReactiveVar(reactiveVarId);
  const authToken = useReactiveVar(reactiveVarToken);
  const activeChannelId = useReactiveVar(activeChatId).activeChannelId;
  const activeDirectMessageId = useReactiveVar(activeChatId)
    .activeDirectMessageId;
  const [listChannelsIsOpen, setListChannelsIsOpen] = useState(true);
  const [modalAddChannelIsOpen, setModalAddChannelIsOpen] = useState(false);

  useEffect(() => {
    if (!activeChannelId && !activeDirectMessageId) {
      if (
        allChannels &&
        Array.isArray(allChannels.userChannels) &&
        allChannels.userChannels[0] &&
        allChannels.userChannels[0].id
      ) {
        activeChatId({ activeChannelId: allChannels.userChannels[0].id });
      } else if (
        listDirectMessages &&
        Array.isArray(listDirectMessages.directMessages) &&
        listDirectMessages.directMessages[0] &&
        listDirectMessages.directMessages[0].id
      ) {
        activeChatId({
          activeDirectMessageId: listDirectMessages.directMessages[0].id,
        });
      }
    }
  }, [allChannels, listDirectMessages]);

  function createLinksChannels(allChannels) {
    if (
      allChannels &&
      Array.isArray(allChannels.userChannels) &&
      authId &&
      authToken
    ) {
      return <CreateChannels channels={allChannels.userChannels} />;
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
