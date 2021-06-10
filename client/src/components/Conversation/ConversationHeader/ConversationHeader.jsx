import React, { useState, useMemo, useRef, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { Name } from './Name';
import { Members } from './Members';
import { ConversationMembers } from '../../Modals/ConversationHeader/ConversationMembers';
import { AddPeopleToChannel } from '../../Modals/AddPeopleToChannel/AddPeopleToChannel';
import imageProfile from '../../../images/Profile.jpg';
import './ConversationHeader.sass';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import {
  CHANNELS,
  ADD_MEMBER_CHANNEL,
} from '../../SetsUser/SetsUserGraphQL/queryes';
import { activeChatId } from '../../../GraphQLApp/reactiveVars.js';

export const ConversationHeader = (props) => {
  const { data: channels } = useQuery(CHANNELS);
  const [modalIsShowsMembers, setModalIsShowsMembers] = useState(false);
  const [modalAddPeopleIsOpen, setModalAddPeopleIsOpen] = useState(false);
  const chatNameRef = useRef('#general');
  const activeChannelId = useReactiveVar(activeChatId).activeChannelId;

  const [addMemberToChannel] = useMutation(ADD_MEMBER_CHANNEL, {
    update: (cache, { data: { channel } }) => {
      if (channels && Array.isArray(channels.userChannels)) {
        const channelsWithChannelHasMember = channels.userChannels.map(
          (userChannel) => {
            if (userChannel && userChannel.id === channel.addMember.id) {
              return { ...userChannel, members: channel.addMember.members };
            }
            return userChannel;
          }
        );
        cache.writeQuery({
          query: CHANNELS,
          data: { ...channels, userChannels: channelsWithChannelHasMember },
        });
      }
    },
    onCompleted(data) {
      //console.log('data   ', data);
    },
    onError(error) {
      console.log(`Помилка при додаванні учасника ${error}`);
    },
  });

  const activeChannel = useMemo(() => {
    if (activeChannelId && channels && Array.isArray(channels.userChannels)) {
      return channels.userChannels.find(
        (channel) => channel !== null && channel.id === activeChannelId
      );
    }
  }, [activeChannelId, channels]);

  useEffect(() => {
    if (activeChannel) {
      chatNameRef.current = activeChannel.name;
    }
  }, [activeChannel]);

  function doneInvite(action, invited = []) {
    if (action === 'done' && invited[0]) {
      addMemberToChannel({ variables: { invited, chatId: activeChannelId } });
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
        chatNameRef={chatNameRef}
        doneInvite={doneInvite}
        modalAddPeopleIsOpen={modalAddPeopleIsOpen}
        setModalAddPeopleIsOpen={setModalAddPeopleIsOpen}
      />
    </div>
  );
};
