import React, { useState, useRef, useEffect, useMemo } from 'react';
import { withStyles } from '@material-ui/core/styles';
import useChatContext from '../../../Context/ChatContext.js';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import { GET_USERS } from '../../../redux/types';
import { SelectPeople } from '../SelectPeople/SelectPeople.jsx';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import './add-people-to-channel.sass';
Modal.setAppElement('#root');

const styles = (theme) => ({
  titleRoot: {
    padding: '24px 16px 0px 16px',
  },
});

export const AddPeopleToChannel = withStyles(styles)((props) => {
  const { resUsers } = useChatContext();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userData);
  const listDirectMessages = useSelector((state) => state.listDirectMessages);
  const activeChannelId = useSelector((state) => state.activeChannelId);
  const userId = useSelector((state) => state.userData._id);
  const {
    chatNameRef,
    doneInvite,
    invited,
    setInvited,
    modalAddPeopleIsOpen,
    setModalAddPeopleIsOpen,
    classes,
  } = props;
  const allUsers = resUsers.users.read();
  const [notInvited, setNotInvited] = useState(null);
  const buttonCloseRef = useRef();
  const buttonDoneRef = useRef();

  useEffect(() => {
    if (userId && allUsers) {
      dispatch({
        type: GET_USERS,
        payload: allUsers,
      });
    }
  }, [userId, allUsers]);

  useEffect(() => {
    if (allUsers.users && userData) {
      let allNotInvited = allUsers.users.filter(
        (user) => user._id !== userData._id
      );
      if (listDirectMessages && listDirectMessages[0]) {
        listDirectMessages.forEach((directMessage) => {
          allNotInvited = allNotInvited.filter(
            (user) => user._id !== directMessage.invited._id
          );
        });
      }
      setNotInvited(allNotInvited);
    }
  }, [allUsers, listDirectMessages]);

  const listMembers = useMemo(() => {
    return allUsers.users ? (
      <ul>
        {allUsers.users.map((user) => (
          <li key={user._id}>{user.name}</li>
        ))}
      </ul>
    ) : null;
  }, [allUsers]);

  console.log(chatNameRef.current);

  return (
    <Dialog
      open={modalAddPeopleIsOpen && !!activeChannelId}
      onClose={() => setModalAddPeopleIsOpen(false)}
      aria-labelledby='form-dialog-title'
    >
      <DialogTitle id='form-dialog-title' classes={{ root: classes.titleRoot }}>
        Invite people to #{chatNameRef.current}
      </DialogTitle>
      <SelectPeople
        invited={invited}
        setInvited={setInvited}
        notInvited={notInvited}
        setNotInvited={setNotInvited}
        buttonCloseRef={buttonCloseRef}
        buttonDoneRef={buttonDoneRef}
        done={doneInvite}
      />
    </Dialog>
  );
});

export default connect(null, null)(AddPeopleToChannel);
