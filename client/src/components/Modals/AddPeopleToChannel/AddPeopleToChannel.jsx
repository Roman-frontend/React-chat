import React, { useRef, useEffect } from 'react';
import { useQuery, useReactiveVar } from '@apollo/client';
import { withStyles } from '@material-ui/core/styles';
import Modal from 'react-modal';
import { SelectPeople } from '../SelectPeople/SelectPeople.jsx';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { GET_USERS, APP, AUTH, CHANNELS } from '../../GraphQL/queryes';
import './add-people-to-channel.sass';
import { reactiveActiveChannelId } from '../../GraphQL/reactiveVariables.js';
Modal.setAppElement('#root');

const styles = (theme) => ({
  titleRoot: {
    padding: '24px 16px 0px 16px',
  },
});

export const AddPeopleToChannel = withStyles(styles)((props) => {
  const { data: auth } = useQuery(AUTH);
  const { data: allChannels } = useQuery(CHANNELS);
  const { data: activeChat } = useQuery(APP);
  const {
    chatNameRef,
    modalAddPeopleIsOpen,
    setModalAddPeopleIsOpen,
    doneInvite,
    classes,
  } = props;
  const activeChannelId = useReactiveVar(reactiveActiveChannelId);

  const { data: allUsers } = useQuery(GET_USERS, {
    onCompleted(data) {
      //console.log(data);
    },
  });

  const notInvitedRef = useRef();

  useEffect(() => {
    if (allUsers && allUsers.users && auth && auth.id) {
      let allNotInvited = allUsers.users.filter((user) => user.id !== auth.id);
      if (activeChannelId && allChannels && allChannels.userChannels[0]) {
        allChannels.userChannels.forEach((channel) => {
          if (channel.id === activeChannelId) {
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
  }, [allUsers, allChannels, auth, activeChat]);

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
