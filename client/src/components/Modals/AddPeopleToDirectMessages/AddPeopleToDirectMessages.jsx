import React, { useRef, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/client';
import { GET_USERS } from '../../Conversation/Messages/GraphQL/queryes';
import { useSelector } from 'react-redux';
import { SelectPeople } from '../SelectPeople/SelectPeople.jsx';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import './add-people-to-channel.sass';

const styles = (theme) => ({
  titleRoot: {
    padding: '24px 16px 0px 16px',
  },
});

export const AddPeopleToDirectMessages = withStyles(styles)((props) => {
  const { loading, error, data: allUsers, client } = useQuery(GET_USERS);
  const userData = useSelector((state) => state.userData);
  const listDirectMessages = useSelector((state) => state.listDirectMessages);
  const {
    done,
    classes,
    modalAddPeopleIsOpen,
    setModalAddPeopleIsOpen,
  } = props;
  const notInvitedRef = useRef();

  useEffect(() => {
    if (allUsers && allUsers.users[0] && userData) {
      let allNotInvited = allUsers.users.filter(
        (user) => user.id !== userData._id
      );
      if (listDirectMessages && listDirectMessages[0]) {
        listDirectMessages.forEach((directMessage) => {
          allNotInvited = allNotInvited.filter(
            (user) => user.id !== directMessage.invited._id
          );
        });
      }
      notInvitedRef.current = allNotInvited;
    }
  }, [allUsers, listDirectMessages, userData]);

  return (
    <>
      <Dialog
        open={modalAddPeopleIsOpen}
        onClose={() => setModalAddPeopleIsOpen(false)}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle
          id='form-dialog-title'
          classes={{ root: classes.titleRoot }}
        >
          Invite people to {userData.name}
        </DialogTitle>
        <SelectPeople notInvitedRef={notInvitedRef} done={done} />
      </Dialog>
    </>
  );
});
