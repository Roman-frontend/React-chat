import React, { useState, useMemo, useRef, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { wsSingleton } from '../../../WebSocket/soket';
import { GET_USERS_ONLINE } from '../../../redux/types';
import { useDispatch, useSelector } from 'react-redux';
import { connect } from 'react-redux';
import { addPeopleToChannel } from '../../../redux/actions/actions.js';
import { Name } from './Name';
import { Members } from './Members';
import { ConversationMembers } from '../../Modals/ConversationHeader/ConversationMembers';
import { AddPeopleToChannel } from '../../Modals/AddPeopleToChannel/AddPeopleToChannel';
import imageProfile from '../../../images/Profile.jpg';
import './ConversationHeader.sass';

export function ConversationHeader() {
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.channels);
  const token = useSelector((state) => state.token);
  const activeChannelId = useSelector((state) => state.activeChannelId);
  const activeDirectMessageId = useSelector(
    (state) => state.activeDirectMessageId
  );
  const usersOnline = useSelector((state) => state.usersOnline);
  const [modalIsShowsMembers, setModalIsShowsMembers] = useState(false);
  const [modalAddPeopleIsOpen, setModalAddPeopleIsOpen] = useState(false);
  const chatNameRef = useRef('#general');

  const activeChannel = useMemo(() => {
    if (channels) {
      if (activeChannelId && channels[0]) {
        return channels.filter((channel) => channel._id === activeChannelId)[0];
      } else if (activeDirectMessageId) {
        return null;
      }
    }
  }, [activeChannelId, channels]);

  useEffect(() => {
    wsSingleton.clientPromise
      .then((wsClient) => {
        wsClient.addEventListener('message', (response) => {
          const parsedRes = JSON.parse(response.data);
          if (parsedRes.message === 'online') {
            if (
              JSON.stringify(usersOnline) !== JSON.stringify(parsedRes.members)
            ) {
              dispatch({
                type: GET_USERS_ONLINE,
                payload: parsedRes.members,
              });
            }
          }
        });
      })
      .catch((error) => console.log(error));
  }, []);

  function doneInvite(action, invited = []) {
    if (action === 'done' && invited[0]) {
      const arrInvited = invited.map((people) => people._id);
      dispatch(
        addPeopleToChannel(token, { invitedUsers: arrInvited }, activeChannelId)
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
        chatNameRef={chatNameRef}
        doneInvite={doneInvite}
        modalAddPeopleIsOpen={modalAddPeopleIsOpen}
        setModalAddPeopleIsOpen={setModalAddPeopleIsOpen}
      />
    </div>
  );
}

const mapDispatchToProps = { addPeopleToChannel };

export default connect(null, mapDispatchToProps)(ConversationHeader);
