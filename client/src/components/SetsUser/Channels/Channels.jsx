import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DrawTitles } from '../DrawTitles.jsx';
import { AddChannel } from '../../Modals/AddChannel/AddChannel';
import { CreateChannels } from './CreateChannels';
import Button from '@material-ui/core/Button';
import { colors } from '@material-ui/core';
import { useQuery, useReactiveVar } from '@apollo/client';
import { CHANNELS } from '../../SetsUser/SetsUserGraphQL/queryes';
import {
  reactiveVarId,
  reactiveVarToken,
} from '../../../GraphQLApp/reactiveVars';

export function Channels() {
  const { t } = useTranslation();
  const { data: allChannels } = useQuery(CHANNELS);
  const authId = useReactiveVar(reactiveVarId);
  const authToken = useReactiveVar(reactiveVarToken);
  const [listChannelsIsOpen, setListChannelsIsOpen] = useState(true);
  const [modalAddChannelIsOpen, setModalAddChannelIsOpen] = useState(false);

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
