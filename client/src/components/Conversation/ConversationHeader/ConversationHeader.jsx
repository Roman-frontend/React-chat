import React, { useState, useMemo, useRef } from 'react';
import Grid from '@material-ui/core/Grid';
import { useDispatch } from 'react-redux';
import { connect } from 'react-redux';
import { addPeopleToChannel } from '../../../redux/actions/actions.js';
import { Name } from './Name';
import { Members } from './Members';
import { ConversationMembers } from '../../Modals/ConversationHeader/ConversationMembers';
import { AddPeopleToChannel } from '../../Modals/AddPeopleToChannel/AddPeopleToChannel';
import imageProfile from '../../../images/Profile.jpg';
import './ConversationHeader.sass';
import { useQuery } from '@apollo/client';
import { CHANNELS, APP, AUTH } from '../../GraphQL/queryes.js';

export const ConversationHeader = (props) => {
  const { resSuspense } = props;
  const dispatch = useDispatch();
  const { data: queryAllChannels } = useQuery(CHANNELS);
  const { data: auth } = useQuery(AUTH);
  const { data: activeChat } = useQuery(APP);
  const [modalIsShowsMembers, setModalIsShowsMembers] = useState(false);
  const [modalAddPeopleIsOpen, setModalAddPeopleIsOpen] = useState(false);
  const chatNameRef = useRef('#general');

  const activeChannel = useMemo(() => {
    if (
      activeChat &&
      activeChat.activeChannelId &&
      queryAllChannels &&
      queryAllChannels.channels &&
      queryAllChannels.channels[0]
    ) {
      return queryAllChannels.channels.filter(
        (channel) => channel.id === activeChat.activeChannelId
      )[0];
    } else if (activeChat && activeChat.activeDirectMessageId) {
      return null;
    }
  }, [activeChat, queryAllChannels]);

  function doneInvite(action, invited = []) {
    if (action === 'done' && invited[0]) {
      const arrInvited = invited.map((people) => people._id);
      dispatch(
        addPeopleToChannel(
          auth.token,
          { invitedUsers: arrInvited },
          activeChat.activeChannelId
        )
      );
    }
    setModalAddPeopleIsOpen(false);
  }

  return (
    <div className='conversation__field-name'>
      <Grid container spacing={1} style={{ alignItems: 'center' }}>
        <Grid item xs={9}>
          <Name activeChannel={activeChannel} />
        </Grid>
        <Grid item xs={2}>
          <Members
            activeChannel={activeChannel}
            setModalIsShowsMembers={setModalIsShowsMembers}
            setModalAddPeopleIsOpen={setModalAddPeopleIsOpen}
          />
        </Grid>
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

const mapDispatchToProps = { addPeopleToChannel };

export default connect(null, mapDispatchToProps)(ConversationHeader);
