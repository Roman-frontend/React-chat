import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import useChatContext from '../../../Context/ChatContext.js';
import { GET_DIRECT_MESSAGES } from '../../../redux/types';
import { useDispatch, useSelector } from 'react-redux';
import { connect } from 'react-redux';
import {
  /* getDirectMessages, */
  postDirectMessages,
} from '../../../redux/actions/actions.js';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/auth.hook.js';
import CreateLists from '../HelpersSetUsers/CreateChatItem';
import { DrawTitles } from '../DrawTitles.jsx';
import { AddPeopleToDirectMessages } from '../../Modals/AddPeopleToDirectMessages/AddPeopleToDirectMessages.jsx';
import { useCallback } from 'react';

export function DirectMessages(props) {
  const { t } = useTranslation();
  const { resDirectMessages } = useChatContext();
  const { socket } = props;
  const { changeStorageUserDataDirectMessages } = useAuth();
  const dispatch = useDispatch();
  const allUsers = useSelector((state) => state.users);
  const token = useSelector((state) => state.token);
  const userData = useSelector((state) => state.userData);
  const listDirectMessages = useSelector((state) => state.listDirectMessages);
  const [invited, setInvited] = useState([]);
  const [listMembersIsOpen, setListMembersIsOpen] = useState(true);
  const [modalAddPeopleIsOpen, setModalAddPeopleIsOpen] = useState(false);
  const resourseDirectMessages = resDirectMessages.listDirectMessages.read();

  useEffect(() => {
    if (resourseDirectMessages) {
      dispatch({
        type: GET_DIRECT_MESSAGES,
        payload: resourseDirectMessages,
      });
    }
  }, [resourseDirectMessages]);

  useEffect(() => {
    if (listDirectMessages && listDirectMessages[0]) {
      const newList = listDirectMessages.map((directMsg) => directMsg._id);
      changeStorageUserDataDirectMessages({ directMessages: newList });
    }
  }, [listDirectMessages]);

  const createArrDirectMessages = useCallback(() => {
    if (
      listDirectMessages &&
      listDirectMessages[0] &&
      allUsers &&
      allUsers[0]
    ) {
      let allRowDirectMessages = [];
      listDirectMessages.forEach((directMessage) => {
        allRowDirectMessages.push(directMessage);
      });
      return (
        <CreateLists
          arrElements={allRowDirectMessages}
          listName={'directMessages'}
          socket={socket}
        />
      );
    }
  }, [listDirectMessages, allUsers]);

  function doneInvite(action) {
    setInvited([]);
    setModalAddPeopleIsOpen(false);

    if (action === 'done' && invited[0]) {
      let dataInvitedPeoples = [];
      invited.forEach((people) => {
        const { _id, name, email } = { ...people };
        dataInvitedPeoples.push({ _id, name, email });
      });
      const body = {
        inviter: {
          _id: userData._id,
          name: userData.name,
          email: userData.email,
        },
        invitedUsers: dataInvitedPeoples,
      };
      dispatch(postDirectMessages(token, body));
    }
  }

  return (
    <>
      <div>
        <DrawTitles
          name={t('description.dirrectMessageTitle')}
          divClass={null}
          classPlus={'left-bar__second-plus'}
          stateShowing={listMembersIsOpen}
          seterStateShowing={setListMembersIsOpen}
          setModalAdd={setModalAddPeopleIsOpen}
        />
      </div>
      <div
        className='user-sets__users'
        style={{ display: listMembersIsOpen ? 'block' : 'none' }}
      >
        {createArrDirectMessages()}
        <Button
          className='user-sets__channel'
          variant='outlined'
          color='primary'
          size='small'
          style={{ background: 'white' }}
          onClick={() => setModalAddPeopleIsOpen(true)}
        >
          + Invite people
        </Button>
        <AddPeopleToDirectMessages
          done={doneInvite}
          invited={invited}
          setInvited={setInvited}
          modalAddPeopleIsOpen={modalAddPeopleIsOpen}
          setModalAddPeopleIsOpen={setModalAddPeopleIsOpen}
        />
        <div className='user-sets__channel'>
          <Link className='main-font' to={`/filterContacts`}>
            Filter Contants
          </Link>
        </div>
      </div>
    </>
  );
}

const mapDispatchToProps = {
  /* getDirectMessages, */
  postDirectMessages,
};

export default connect(null, mapDispatchToProps)(DirectMessages);

//НЕ ВИДАЛЯТИ ПОКИЩО створює список учасників активного каналу
/*  
  import {useSelector} from 'react-redux'
  const allChannels = useSelector(state => state.channels)
  const activeChannelId = useSelector(state => state.activeChannelId)

  const activeChannel = useMemo(() => {
    if (activeChannelId && allChannels) {
      return allChannels.filter(channel => channel._id === activeChannelId)
    }
  }, [activeChannelId, allChannels]) 
  const createListMembers = useCallback(() => {
    return activeChannel[0].members.map( member => {
      return (
        <div key={member._id} id={member._id} className="user-sets__people">
          <Link className="main-font" to={`/chat`}>{member.name}</Link>
        </div>
      )
    })
  }, [activeChannel])*/
