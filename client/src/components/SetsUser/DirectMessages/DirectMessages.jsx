import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { colors } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@apollo/client';
import { AUTH, GET_USERS } from '../../../GraphQLApp/queryes';
import {
  CREATE_DIRECT_MESSAGE,
  GET_DIRECT_MESSAGES,
} from '../../SetsUser/SetsUserGraphQL/queryes';
import { reactiveDirectMessages } from '../../../GraphQLApp/reactiveVars';
import { Link } from 'react-router-dom';
import { DirectMessage } from './DirectMessage';
import { AddPeopleToDirectMessages } from '../../Modals/AddPeopleToDirectMessages/AddPeopleToDirectMessages.jsx';
import { useCallback } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export function DirectMessages() {
  const { t } = useTranslation();
  const { data: auth } = useQuery(AUTH);
  const [modalAddPeopleIsOpen, setModalAddPeopleIsOpen] = useState(false);
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const { data: users } = useQuery(GET_USERS);
  const { data: directMessages } = useQuery(GET_DIRECT_MESSAGES);

  const [createDirectMessage] = useMutation(CREATE_DIRECT_MESSAGE, {
    update(cache, { data: { directMessage } }) {
      const ready = cache.readQuery({
        query: GET_DIRECT_MESSAGES,
        variables: { id: auth.directMessagesId },
      });
      console.log(directMessage);
      cache.modify({
        fields: {
          directMessages() {
            return [...ready.directMessages, ...directMessage.create];
          },
        },
      });
    },
    onError(error) {
      console.log(`Помилка ${error}`);
    },
    onCompleted(data) {
      const storage = JSON.parse(sessionStorage.getItem('storageData'));
      const newDrMsgIds = data.directMessage.create.map(({ id }) => id);
      const toStorage = JSON.stringify({
        ...storage,
        directMessages: [...storage.directMessages, ...newDrMsgIds],
      });
      sessionStorage.setItem('storageData', toStorage);
      reactiveDirectMessages([...reactiveDirectMessages(), ...newDrMsgIds]);
    },
  });

  const createLinksDirectMessages = useCallback(() => {
    if (
      directMessages &&
      Array.isArray(directMessages.directMessages) &&
      users &&
      Array.isArray(users.users)
    ) {
      return <DirectMessage reqRowElements={directMessages.directMessages} />;
    }
  }, [directMessages, users]);

  function doneInvite(action, invited) {
    setModalAddPeopleIsOpen(false);

    if (action === 'done' && invited) {
      console.log('done ', { inviter: auth.id, invited });
      createDirectMessage({
        variables: { inviter: auth.id, invited },
      });
    }
  }

  return (
    <>
      <div>
        <List component='nav' className={classes.root}>
          <ListItem button onClick={() => setOpen(!open)}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary={t('description.dirrectMessageTitle')} />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <List component='div' disablePadding>
              {createLinksDirectMessages()}
            </List>
          </Collapse>
        </List>
      </div>
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
    </>
  );
}
