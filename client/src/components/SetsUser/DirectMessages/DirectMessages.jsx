import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
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
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export function DirectMessages(props) {
  const { setAlertData, isOpenLeftBar } = props;
  const { t } = useTranslation();
  const { data: auth } = useQuery(AUTH);
  const [modalAddPeopleIsOpen, setModalAddPeopleIsOpen] = useState(false);
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const { data: directMessages } = useQuery(GET_DIRECT_MESSAGES);

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
      setAlertData(data.directMessages.create);
    },
  });

  function doneInvite(action, invited) {
    if (action === 'done' && invited && invited[0]) {
      console.log(invited);
      createDirectMessage({
        variables: { inviter: auth.id, invited },
      });
      setModalAddPeopleIsOpen(false);
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
                  <DirectMessage
                    drMsg={drMsg}
                    setAlertData={setAlertData}
                    isOpenLeftBar={isOpenLeftBar}
                  />
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
        onClick={() => setModalAddPeopleIsOpen(true)}
      >
        {isOpenLeftBar ? '+ new dm' : '+'}
      </Button>
      <AddDirectMessage
        done={doneInvite}
        modalAddPeopleIsOpen={modalAddPeopleIsOpen}
        setModalAddPeopleIsOpen={setModalAddPeopleIsOpen}
      />
    </>
  );
}
