import React, { useRef, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/client';
import { GET_USERS } from '../../../GraphQLApp/queryes';
import { SelectPeople } from '../SelectPeople/SelectPeople.jsx';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import './add-people-to-channel.sass';
import {
  reactiveVarName,
  reactiveVarId,
} from '../../../GraphQLApp/reactiveVars';
import { GET_DIRECT_MESSAGES } from '../../SetsUser/SetsUserGraphQL/queryes';

const styles = (theme) => ({
  titleRoot: {
    padding: '24px 16px 0px 16px',
  },
});

export const CreateDirectMessage = withStyles(styles)((props) => {
  const { data: allUsers } = useQuery(GET_USERS);
  const { data: drMessages } = useQuery(GET_DIRECT_MESSAGES, {
    onCompleted(data) {
      //console.log(data);
    },
  });
  const { done, classes, modalAddPeopleIsOpen, setModalAddPeopleIsOpen } =
    props;
  const notInvitedRef = useRef();

  useEffect(() => {
    if (allUsers && allUsers.users[0] && reactiveVarId()) {
      let allNotInvited = allUsers.users.filter(
        (user) => user.id !== reactiveVarId()
      );
      if (
        drMessages &&
        drMessages.directMessages &&
        drMessages.directMessages[0]
      ) {
        drMessages.directMessages.forEach((directMessage) => {
          directMessage.members.forEach((memberId) => {
            allNotInvited = allNotInvited.filter(
              (user) => user.id !== memberId
            );
          });
        });
      }
      notInvitedRef.current = allNotInvited;
      //notInvitedRef.current = allUsers.users;
    }
  }, [allUsers, drMessages, reactiveVarId()]);

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
          Invite people to {reactiveVarName()}
        </DialogTitle>
        <SelectPeople notInvitedRef={notInvitedRef} done={done} />
      </Dialog>
    </>
  );
});
