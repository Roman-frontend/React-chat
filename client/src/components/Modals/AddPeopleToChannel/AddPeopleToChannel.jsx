import React, { useState, useRef, useEffect } from 'react';
import useChatContext from '../../../Context/ChatContext.js';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import { GET_USERS } from '../../../redux/types';
import { SelectPeople } from '../SelectPeople/SelectPeople.jsx';
import './add-people-to-channel.sass';
Modal.setAppElement('#root');

export function AddPeopleToChannel(props) {
  const { resUsers } = useChatContext();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);
  const userData = useSelector((state) => state.userData);
  const listDirectMessages = useSelector((state) => state.listDirectMessages);
  const activeChannelId = useSelector((state) => state.activeChannelId);
  const userId = useSelector((state) => state.userData._id);
  const {
    doneInvite,
    invited,
    setInvited,
    modalAddPeopleIsOpen,
    setModalAddPeopleIsOpen,
  } = props;
  const allUsers = resUsers.users.read();
  const [notInvited, setNotInvited] = useState(null);
  const parrentDivRef = useRef();
  const buttonCloseRef = useRef();
  const buttonDoneRef = useRef();
  const heightParrentDiv = 'set-channel__invite_height';

  useEffect(() => {
    if (userId && allUsers) {
      dispatch({
        type: GET_USERS,
        payload: allUsers,
      });
    }
  }, [userId, allUsers]);

  useEffect(() => {
    if (users && userData) {
      let allNotInvited = users.filter((user) => user._id !== userData._id);
      if (users && listDirectMessages && listDirectMessages[0]) {
        listDirectMessages.forEach((directMessage) => {
          allNotInvited = allNotInvited.filter(
            (user) => user._id !== directMessage.invited._id
          );
        });
      }
      setNotInvited(allNotInvited);
    }
  }, [users, listDirectMessages]);

  console.log(allUsers);

  return (
    <Modal
      isOpen={modalAddPeopleIsOpen && !!activeChannelId}
      onRequestClose={() => setModalAddPeopleIsOpen(false)}
      className={'modal-content'}
      overlayClassName={'modal-overlay'}
    >
      <div className='set-channel' ref={parrentDivRef}>
        <p className='set-channel-forms__main-label-text'>
          Invite people to {userData.name}
        </p>
        <ul>
          {allUsers.users.map((name) => (
            <li key={name._id}>{name.name}</li>
          ))}
        </ul>
        <SelectPeople
          invited={invited}
          setInvited={setInvited}
          notInvited={notInvited}
          setNotInvited={setNotInvited}
          parrentDivRef={parrentDivRef}
          buttonCloseRef={buttonCloseRef}
          buttonDoneRef={buttonDoneRef}
          heightParrentDiv={heightParrentDiv}
        />

        <button
          className='set-channel__button'
          ref={buttonCloseRef}
          onClick={doneInvite}
        >
          Close
        </button>

        <button
          type='submit'
          className='set-channel__button'
          ref={buttonDoneRef}
          onClick={() => doneInvite('invite')}
        >
          Invite
        </button>
      </div>
    </Modal>
  );
}

export default connect(null, null)(AddPeopleToChannel);
