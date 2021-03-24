import React, { useRef, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { withStyles } from '@material-ui/core/styles';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import { SelectPeople } from '../SelectPeople/SelectPeople.jsx';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { GET_USERS } from '../../Conversation/Messages/GraphQL/queryes';
import './add-people-to-channel.sass';
Modal.setAppElement('#root');

const styles = (theme) => ({
  titleRoot: {
    padding: '24px 16px 0px 16px',
  },
});

export const AddPeopleToChannel = withStyles(styles)((props) => {
  const userData = useSelector((state) => state.userData);
  const channels = useSelector((state) => state.channels);
  const activeChannelId = useSelector((state) => state.activeChannelId);
  const {
    chatNameRef,
    modalAddPeopleIsOpen,
    setModalAddPeopleIsOpen,
    doneInvite,
    classes,
  } = props;
  const { loading, error, data: allUsers } = useQuery(GET_USERS, {
    onCompleted(data) {
      console.log(data);
    },
  });

  const notInvitedRef = useRef();

  useEffect(() => {
    if (allUsers && allUsers.users && userData) {
      let allNotInvited = allUsers.users.filter(
        (user) => user.id !== userData._id
      );
      if (activeChannelId && channels && channels[0]) {
        channels.forEach((channel) => {
          if (channel._id === activeChannelId) {
            channel.members.forEach((memberId) => {
              allNotInvited = allNotInvited.filter((user) => {
                return user.id !== memberId;
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
        open={modalAddPeopleIsOpen}
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
