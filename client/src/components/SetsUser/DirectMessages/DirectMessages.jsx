import React, { useEffect, useState } from 'react';
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
import {
  CREATE_DIRECT_MESSAGE,
  GET_DIRECT_MESSAGES,
  GET_USERS,
  AUTH,
} from '../../GraphQL/queryes';
import {
  reactiveActiveDirrectMessageId,
  reactiveDirectMessages,
} from '../../GraphQL/reactiveVariables';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import DirectMessage from './DirectMessage';
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

export function DirectMessages(props) {
  const { t } = useTranslation();
  const { data: auth } = useQuery(AUTH);
  const [modalAddPeopleIsOpen, setModalAddPeopleIsOpen] = useState(false);
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const { data: users } = useQuery(GET_USERS);
  const { data: directMessages } = useQuery(GET_DIRECT_MESSAGES);

  const [createDirectMessage] = useMutation(CREATE_DIRECT_MESSAGE, {
    update(cache, { data: { createDirectMessage } }) {
      const ready = cache.readQuery({
        query: GET_DIRECT_MESSAGES,
        variables: { id: auth.directMessagesId },
      });
      cache.modify({
        fields: {
          directMessages() {
            return [...ready.directMessages, ...createDirectMessage];
          },
        },
      });
      console.log(ready, createDirectMessage);
      /* cache.writeQuery({
        query: GET_DIRECT_MESSAGES,
        data: {
          directMessages: [...ready.directMessages, ...createDirectMessage],
        },
      }); */
    },
    onError(error) {
      console.log(`Помилка ${error}`);
    },
    onCompleted(data) {
      const storage = JSON.parse(sessionStorage.getItem('storageData'));
      const newDrMsgIds = data.createDirectMessage.map((drMsg) => drMsg.id);
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
      directMessages.directMessages &&
      directMessages.directMessages[0] &&
      users &&
      users.users &&
      users.users[0]
    ) {
      return <DirectMessage reqRowElements={directMessages.directMessages} />;
    }
  }, [directMessages, users]);

  function doneInvite(action, invited) {
    setModalAddPeopleIsOpen(false);

    if (action === 'done' && invited) {
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

export default connect(null, null)(DirectMessages);
