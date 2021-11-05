import React, { useRef, useEffect } from 'react';
import Modal from 'react-modal';
import { useQuery, useReactiveVar } from '@apollo/client';
import { useTheme } from '@mui/material/styles';
import { withStyles } from '@mui/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { SelectPeople } from '../SelectPeople/SelectPeople.jsx';
import { AUTH, GET_USERS } from '../../../GraphQLApp/queryes';
import { CHANNELS } from '../../SetsUser/SetsUserGraphQL/queryes';
import { activeChatId } from '../../../GraphQLApp/reactiveVars.js';
Modal.setAppElement('#root');

const styles = (theme) => ({
  titleRoot: {
    padding: '24px 16px 0px 16px',
  },
});

export const AddPeopleToChannel = withStyles(styles)((props) => {
  const {
    chatNameRef,
    isErrorInPopap,
    modalAddPeopleIsOpen,
    setModalAddPeopleIsOpen,
    doneInvite,
    classes,
  } = props;
  const theme = useTheme();
  const { data: auth } = useQuery(AUTH);
  const { data: allChannels } = useQuery(CHANNELS);
  const { data: allUsers } = useQuery(GET_USERS);
  const notInvitedRef = useRef();
  const activeChannelId = useReactiveVar(activeChatId).activeChannelId;

  useEffect(() => {
    if (allUsers && allUsers.users && auth && auth.id) {
      let allNotInvited = allUsers.users.filter((user) => user.id !== auth.id);
      if (
        activeChannelId &&
        allChannels &&
        Array.isArray(allChannels.userChannels)
      ) {
        allChannels.userChannels.forEach((channel) => {
          if (channel && channel.id === activeChannelId) {
            channel.members.forEach((memberId) => {
              allNotInvited = allNotInvited.filter((user) => {
                return user.id !== memberId;
              });
            });
          }
        });
      }
      notInvitedRef.current = allNotInvited;
      //notInvitedRef.current = allUsers.users;
    }
  }, [allUsers, allChannels, auth, activeChannelId]);

  const closePopap = () => {
    setModalAddPeopleIsOpen(false);
  };

  return (
    <>
      <Dialog
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: theme.palette.primary.main,
          },
        }}
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
        <SelectPeople
          closePopap={closePopap}
          isErrorInPopap={isErrorInPopap}
          notInvitedRef={notInvitedRef.current}
          done={doneInvite}
        />
      </Dialog>
    </>
  );
});
