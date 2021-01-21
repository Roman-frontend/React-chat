import React, { useRef, useEffect } from 'react';
import { GET_USERS } from '../../../redux/types';
import { withStyles } from '@material-ui/core/styles';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
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
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userData);
  const channels = useSelector((state) => state.channels);
  const activeChannelId = useSelector((state) => state.activeChannelId);
  const userId = useSelector((state) => state.userData._id);
  const {
    resSuspense,
    chatNameRef,
    modalAddPeopleIsOpen,
    setModalAddPeopleIsOpen,
    doneInvite,
    classes,
  } = props;
  const allUsers = resSuspense.users.read();
  const notInvitedRef = useRef();

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
      if (activeChannelId && channels && channels[0]) {
        channels.forEach((channel) => {
          if (channel._id === activeChannelId) {
            channel.members.forEach((memberId) => {
              allNotInvited = allNotInvited.filter((user) => {
                return user._id !== memberId;
              });
            });
          }
        });
      }
      notInvitedRef.current = allNotInvited;
    }
  }, [allUsers, channels, userData, activeChannelId]);

  return (
    <>
      <Dialog
        open={modalAddPeopleIsOpen && !!activeChannelId}
        onClose={() => setModalAddPeopleIsOpen(false)}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle
          id='form-dialog-title'
          classes={{ root: classes.titleRoot }}
        >
          Invite people to #{chatNameRef.current}
        </DialogTitle>
        <SelectPeople notInvitedRef={notInvitedRef} done={doneInvite} />
      </Dialog>
    </>
  );
});

export default connect(null, null)(AddPeopleToChannel);
