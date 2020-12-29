import React, { useState, useRef, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
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
  const users = useSelector((state) => state.users);
  const userData = useSelector((state) => state.userData);
  const listDirectMessages = useSelector((state) => state.listDirectMessages);
  const {
    done,
    invited,
    setInvited,
    modalAddPeopleIsOpen,
    setModalAddPeopleIsOpen,
    classes,
  } = props;
  const [notInvited, setNotInvited] = useState(null);
  const buttonCloseRef = useRef();
  const buttonDoneRef = useRef();

  useEffect(() => {
    if (users && users[0] && userData) {
      let allNotInvited = users.filter((user) => user._id !== userData._id);
      if (listDirectMessages && listDirectMessages[0]) {
        listDirectMessages.forEach((directMessage) => {
          allNotInvited = allNotInvited.filter(
            (user) => user._id !== directMessage.invited._id
          );
        });
      }
      setNotInvited(allNotInvited);
    }
  }, [users, listDirectMessages]);

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
        <SelectPeople
          invited={invited}
          setInvited={setInvited}
          notInvited={notInvited}
          setNotInvited={setNotInvited}
          buttonCloseRef={buttonCloseRef}
          buttonDoneRef={buttonDoneRef}
          done={done}
        />
      </Dialog>
    </>
  );
});
