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
import { useApolloClient, gql, useQuery, useMutation } from '@apollo/client';
import {
  CREATE_DIRECT_MESSAGE,
  GET_DIRECT_MESSAGES,
  GET_ALL_DIRECT_MESSAGES,
  GET_USERS,
} from '../../Conversation/Messages/GraphQL/queryes';
import { useSelector } from 'react-redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/auth.hook.js';
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
  const { resSuspense } = props;
  const { t } = useTranslation();
  const { changeStorage } = useAuth();
  const allUsers = useSelector((state) => state.users);
  const token = useSelector((state) => state.token);
  const userData = useSelector((state) => state.userData);
  const directMsgs = useSelector((state) => state.listDirectMessages);
  const [modalAddPeopleIsOpen, setModalAddPeopleIsOpen] = useState(false);
  const resourseDirectMessages = resSuspense.listDirectMessages.read();
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const { data: users } = useQuery(GET_USERS, {
    onError(error) {
      console.log(`Некоректні дані при отриманні users ${error}`);
    },
  });

  const { data: drMessages } = useQuery(GET_ALL_DIRECT_MESSAGES, {
    onCompleted(data) {
      console.log(data);
    },
    onError(error) {
      console.log(`Некоректні дані  ${error}`);
    },
  });

  const [
    createDirectMessage,
    { data: created, called, loading: loaded, error: errorCreate, client },
  ] = useMutation(CREATE_DIRECT_MESSAGE, {
    update(cache, { data: { createDirectMessage } }) {
      const ready = cache.readQuery({
        query: GET_ALL_DIRECT_MESSAGES,
      });
      cache.writeQuery({
        query: GET_ALL_DIRECT_MESSAGES,
        data: {
          allDirectMessages: [
            ...ready.allDirectMessages,
            ...createDirectMessage,
          ],
        },
      });
    },
    refetchQueries: true,
    onError(error) {
      console.log(`Помилка ${error}`);
    },
  });

  useEffect(() => {
    if (directMsgs && directMsgs[0]) {
      const newList = directMsgs.map((directMsg) => directMsg._id);
      changeStorage({ directMessages: newList });
    }
  }, [directMsgs]);

  const createLinksDirectMessages = useCallback(() => {
    console.log(users.users, drMessages);
    if (
      drMessages &&
      drMessages.allDirectMessages &&
      drMessages.allDirectMessages[0] &&
      users.users &&
      users.users[0]
    ) {
      console.log(drMessages.allDirectMessages);
      return <DirectMessage reqRowElements={drMessages.allDirectMessages} />;
    }
  }, [drMessages, users]);

  function doneInvite(action, invited) {
    setModalAddPeopleIsOpen(false);

    if (action === 'done' && invited) {
      //console.log({ inviter: userData._id, invited });
      createDirectMessage({
        variables: {
          inviter: userData._id,
          invited,
        },
      });
    }
  }

  console.log(drMessages);

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
