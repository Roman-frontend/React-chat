import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { colors } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { GET_DIRECT_MESSAGES } from '../../../redux/types';
import { useDispatch, useSelector } from 'react-redux';
import { connect } from 'react-redux';
import { postDirectMessages } from '../../../redux/actions/actions.js';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/auth.hook.js';
import CreateLists from '../HelpersSetUsers/ChatItem/CreateChatItem';
import { DrawTitles } from '../DrawTitles.jsx';
import { AddPeopleToDirectMessages } from '../../Modals/AddPeopleToDirectMessages/AddPeopleToDirectMessages.jsx';
import { useCallback } from 'react';

export function DirectMessages(props) {
  const { resSuspense } = props;
  const { t } = useTranslation();
  const { changeStorage } = useAuth();
  const dispatch = useDispatch();
  const allUsers = useSelector((state) => state.users);
  const token = useSelector((state) => state.token);
  const userData = useSelector((state) => state.userData);
  const directMsgs = useSelector((state) => state.listDirectMessages);
  const [listMembersIsOpen, setListMembersIsOpen] = useState(true);
  const [modalAddPeopleIsOpen, setModalAddPeopleIsOpen] = useState(false);
  const resourseDirectMessages = resSuspense.listDirectMessages.read();

  useEffect(() => {
    if (resourseDirectMessages) {
      dispatch({
        type: GET_DIRECT_MESSAGES,
        payload: resourseDirectMessages,
      });
    }
  }, [resourseDirectMessages]);

  useEffect(() => {
    if (directMsgs && directMsgs[0]) {
      const newList = directMsgs.map((directMsg) => directMsg._id);
      changeStorage({ directMessages: newList });
    }
  }, [directMsgs]);

  const createLinksDirectMessages = useCallback(() => {
    if (directMsgs && directMsgs[0] && allUsers && allUsers[0]) {
      return (
        <CreateLists reqRowElements={directMsgs} listName={'directMessages'} />
      );
    }
  }, [directMsgs, allUsers]);

  function doneInvite(action, invited = []) {
    setModalAddPeopleIsOpen(false);

    if (action === 'done' && invited[0]) {
      const invitedData = invited.map((people) => {
        const { _id, name, email } = { ...people };
        return { _id, name, email };
      });
      const body = {
        inviter: {
          _id: userData._id,
          name: userData.name,
          email: userData.email,
        },
        invitedUsers: invitedData,
      };
      console.log('postDirectMessages');
      dispatch(postDirectMessages(token, body));
    }
  }

  return (
    <>
      <div>
        <DrawTitles
          name={t('description.dirrectMessageTitle')}
          divClass={null}
          stateShowing={listMembersIsOpen}
          seterStateShowing={setListMembersIsOpen}
          setModalAdd={setModalAddPeopleIsOpen}
        />
      </div>
      <div
        className='user-sets__users'
        style={{ display: listMembersIsOpen ? 'block' : 'none' }}
      >
        {createLinksDirectMessages()}
        <Button
          variant='contained'
          color='primary'
          size='small'
          style={{ background: colors.indigo[500], width: '100%' }}
          onClick={() => setModalAddPeopleIsOpen(true)}
        >
          + Invite people
        </Button>
        <AddPeopleToDirectMessages
          done={doneInvite}
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

const mapDispatchToProps = { postDirectMessages };

export default connect(null, mapDispatchToProps)(DirectMessages);
