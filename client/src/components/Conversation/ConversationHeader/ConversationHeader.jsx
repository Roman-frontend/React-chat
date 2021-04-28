import React, { useState, useMemo, useRef } from 'react';
import Grid from '@material-ui/core/Grid';
import { Name } from './Name';
import { Members } from './Members';
import { ConversationMembers } from '../../Modals/ConversationHeader/ConversationMembers';
import { AddPeopleToChannel } from '../../Modals/AddPeopleToChannel/AddPeopleToChannel';
import imageProfile from '../../../images/Profile.jpg';
import './ConversationHeader.sass';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { AUTH } from '../../../GraphQLApp/queryes.js';
import {
  CHANNELS,
  ADD_MEMBER_CHANNEL,
} from '../../SetsUser/SetsUserGraphQL/queryes';
import { reactiveActiveChannelId } from '../../../GraphQLApp/reactiveVariables.js';

export const ConversationHeader = (props) => {
  const { resSuspense } = props;
  const { data: channels } = useQuery(CHANNELS);
  const { data: auth } = useQuery(AUTH);
  const [modalIsShowsMembers, setModalIsShowsMembers] = useState(false);
  const [modalAddPeopleIsOpen, setModalAddPeopleIsOpen] = useState(false);
  const chatNameRef = useRef('#general');
  const activeChannelId = useReactiveVar(reactiveActiveChannelId);

  const [addMember] = useMutation(ADD_MEMBER_CHANNEL, {
    onError(error) {
      console.log(`Помилка при додаванні учасника ${error}`);
    },
  });

  const activeChannel = useMemo(() => {
    if (
      activeChannelId &&
      channels &&
      Array.isArray(channels.userChannels) &&
      channels.userChannels[0]
    ) {
      return channels.userChannels.find(
        (channel) => channel !== null && channel.id === activeChannelId
      );
    }
    return null;
  }, [activeChannelId, channels]);

  function doneInvite(action, invited = []) {
    if (action === 'done' && invited[0]) {
      addMember({
        variables: { token: auth.token, invited, chatId: activeChannelId },
      });
    }
    setModalAddPeopleIsOpen(false);
  }

  return (
    <div className='conversation__field-name'>
      <Grid
        container
        spacing={1}
        style={{ alignItems: 'center', height: '4.3rem' }}
      >
        <Grid item xs={9}>
          <Name activeChannel={activeChannel} />
        </Grid>
        {activeChannelId && (
          <Grid item xs={2}>
            <Members
              activeChannel={activeChannel}
              setModalIsShowsMembers={setModalIsShowsMembers}
              setModalAddPeopleIsOpen={setModalAddPeopleIsOpen}
            />
          </Grid>
        )}
      </Grid>
      <ConversationMembers
        activeChannel={activeChannel}
        modalIsShowsMembers={modalIsShowsMembers}
        setModalIsShowsMembers={setModalIsShowsMembers}
      />
      <AddPeopleToChannel
        resSuspense={resSuspense}
        chatNameRef={chatNameRef}
        doneInvite={doneInvite}
        modalAddPeopleIsOpen={modalAddPeopleIsOpen}
        setModalAddPeopleIsOpen={setModalAddPeopleIsOpen}
      />
    </div>
  );
};
