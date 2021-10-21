import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { AUTH } from '../../../GraphQLApp/queryes';
import {
  CREATE_DIRECT_MESSAGE,
  GET_DIRECT_MESSAGES,
} from '../../SetsUser/SetsUserGraphQL/queryes';
import { reactiveDirectMessages } from '../../../GraphQLApp/reactiveVars';
import { AddDirectMessage } from '../../Modals/AddDirectMessage/AddDirectMessage.jsx';
import { DirectMessage } from './DirectMessage';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
  },
}));

export function DirectMessages(props) {
  const {
    isOpenLeftBar,
    isErrorInPopap,
    setIsErrorInPopap,
    modalAddDmIsOpen,
    setModalAddDmIsOpen,
  } = props;
  const { t } = useTranslation();
  const { data: auth } = useQuery(AUTH);
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const { data: directMessages } = useQuery(GET_DIRECT_MESSAGES);
  const { enqueueSnackbar } = useSnackbar();

  const [createDirectMessage] = useMutation(CREATE_DIRECT_MESSAGE, {
    update(cache, { data: { directMessages } }) {
      cache.modify({
        fields: {
          directMessages(existingDrMsg) {
            const newCommentRef = directMessages.create.record.map(
              (newDrMsg) => {
                return cache.writeFragment({
                  data: newDrMsg,
                  fragment: gql`
                    fragment NewDirectMessage on DirectMessage {
                      id
                      members
                    }
                  `,
                });
              }
            );
            return [...existingDrMsg, ...newCommentRef];
          },
        },
      });
    },
    onError(error) {
      console.log(`Помилка ${error}`);
      enqueueSnackbar('Direct Message created!', { variant: 'error' });
    },
    onCompleted(data) {
      console.log(data);
      const storage = JSON.parse(sessionStorage.getItem('storageData'));
      const newDrMsgIds = data.directMessages.create.record.map(({ id }) => id);
      const toStorage = JSON.stringify({
        ...storage,
        directMessages: [...storage.directMessages, ...newDrMsgIds],
      });
      sessionStorage.setItem('storageData', toStorage);
      reactiveDirectMessages([...reactiveDirectMessages(), ...newDrMsgIds]);
      enqueueSnackbar('Direct Message created!', { variant: 'success' });
    },
  });

  function doneInvite(action, invited) {
    if (action === 'done' && invited && invited[0]) {
      console.log(invited);
      createDirectMessage({
        variables: { inviter: auth.id, invited },
      });
      setModalAddDmIsOpen(false);
    } else {
      setIsErrorInPopap(true);
    }
  }

  return (
    <>
      <div>
        <List component='nav' className={classes.root}>
          {isOpenLeftBar ? (
            <ListItem
              style={{ paddingLeft: 0 }}
              button
              onClick={() => setOpen(!open)}
            >
              <ListItemIcon style={{ justifyContent: 'center' }}>
                <EmojiPeopleIcon color='action' />
              </ListItemIcon>
              <ListItemText
                style={{ textAlign: 'center' }}
                primary={t('description.dirrectMessageTitle')}
              />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
          ) : (
            <ListItem
              style={{ padding: 0, margin: 0, justifyContent: 'center' }}
              button
              onClick={() => setOpen(!open)}
            >
              <ListItemIcon style={{ padding: '0', justifyContent: 'center' }}>
                <EmojiPeopleIcon color='action' />
              </ListItemIcon>
            </ListItem>
          )}
          <Collapse in={open} timeout='auto' unmountOnExit>
            <List>
              {directMessages &&
                directMessages.directMessages.map((drMsg) => (
                  <DirectMessage key={drMsg.id} drMsg={drMsg} />
                ))}
            </List>
          </Collapse>
        </List>
      </div>
      <Button
        size='small'
        style={{
          width: '100%',
          padding: 0,
        }}
        color='warning'
        onClick={() => setModalAddDmIsOpen(true)}
      >
        {isOpenLeftBar ? '+ new dm' : '+'}
      </Button>
      <AddDirectMessage
        done={doneInvite}
        modalAddDmIsOpen={modalAddDmIsOpen}
        setModalAddDmIsOpen={setModalAddDmIsOpen}
        isErrorInPopap={isErrorInPopap}
      />
    </>
  );
}
