import React, { useState, useMemo, useRef, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import GroupIcon from '@material-ui/icons/Group';
import IconButton from '@material-ui/core/IconButton';
import { Members } from './Members';
import { ConversationMembers } from '../../Modals/ConversationHeader/ConversationMembers';
import { AddPeopleToChannel } from '../../Modals/AddPeopleToChannel/AddPeopleToChannel';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import {
  CHANNELS,
  ADD_MEMBER_CHANNEL,
} from '../../SetsUser/SetsUserGraphQL/queryes';
import { activeChatId } from '../../../GraphQLApp/reactiveVars.js';

export const ConversationHeaderChannel = (props) => {
  const { isOpenRightBarChannels, setIsOpenRightBarChannels } = props;
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
      console.log(invited);
      addMemberToChannel({ variables: { invited, chatId: activeChannelId } });
      setModalAddPeopleIsOpen(false);
    }
  }

  function openRightBarChannels() {
    setIsOpenRightBarChannels(!isOpenRightBarChannels);
  }

  return (
    <div className='conversation__field-name'>
      <Grid
        container
        spacing={1}
        style={{ alignItems: 'center', height: '4.3rem', padding: '0vh 1vw' }}
        justify='space-between'
      >
        <Grid item xs={8}>
          <b className='conversation__name'>
            ✩ {activeChannel ? activeChannel.name : '#general'}
          </b>
        </Grid>
        <Grid item xs={2} style={{ alignSelf: 'center' }}>
          <Members
            activeChannel={activeChannel}
            setModalIsShowsMembers={setModalIsShowsMembers}
            setModalAddPeopleIsOpen={setModalAddPeopleIsOpen}
            isOpenRightBarChannels={isOpenRightBarChannels}
            setIsOpenRightBarChannels={setIsOpenRightBarChannels}
          />
        </Grid>
        <Grid item xs={1} style={{ textAlign: 'center' }}>
          <GroupAddIcon
            style={{ fontSize: 50, cursor: 'pointer' }}
            onClick={() => setModalAddPeopleIsOpen(true)}
          />
        </Grid>
        <Grid item xs={1} style={{ alignSelf: 'center', cursor: 'pointer' }}>
          <IconButton
            edge='end'
            aria-label='account of current user'
            aria-haspopup='true'
            color='inherit'
            onClick={openRightBarChannels}
          >
            <GroupIcon
              style={{
                background: 'cadetblue',
                borderRadius: '50%',
                fontSize: 40,
              }}
            />
          </IconButton>
        </Grid>
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
