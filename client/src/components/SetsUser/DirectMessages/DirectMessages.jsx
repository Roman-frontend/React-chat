import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { colors } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import { useTranslation } from 'react-i18next';
import { GET_DIRECT_MESSAGES } from '../../../redux/types';
import { useDispatch, useSelector } from 'react-redux';
import { connect } from 'react-redux';
import { postDirectMessages } from '../../../redux/actions/actions.js';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/auth.hook.js';
import DirectMessage from './DirectMessage';
import { Title } from '../Title.jsx';
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
  const dispatch = useDispatch();
  const allUsers = useSelector((state) => state.users);
  const token = useSelector((state) => state.token);
  const userData = useSelector((state) => state.userData);
  const directMsgs = useSelector((state) => state.listDirectMessages);
  const [listMembersIsOpen, setListMembersIsOpen] = useState(true);
  const [modalAddPeopleIsOpen, setModalAddPeopleIsOpen] = useState(false);
  const resourseDirectMessages = resSuspense.listDirectMessages.read();
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  useEffect(() => {
    if (resourseDirectMessages) {
      dispatch({
        type: GET_DIRECT_MESSAGES,
        payload: resourseDirectMessages,
      });
    }
  }, [resourseDirectMessages]);

  useEffect(() => {
    if (directMsgs && directMsgs[0]) {
      const newList = directMsgs.map((directMsg) => directMsg._id);
      changeStorage({ directMessages: newList });
    }
  }, [directMsgs]);

  const createLinksDirectMessages = useCallback(() => {
    if (directMsgs && directMsgs[0] && allUsers && allUsers[0]) {
      return <DirectMessage reqRowElements={directMsgs} />;
    }
  }, [directMsgs, allUsers]);

  function doneInvite(action, invited = []) {
    setModalAddPeopleIsOpen(false);

    if (action === 'done' && invited[0]) {
      const invitedData = invited.map((people) => {
        const { _id, name, email } = { ...people };
        return { _id, name, email };
      });
      const body = {
        inviter: {
          _id: userData._id,
          name: userData.name,
          email: userData.email,
        },
        invitedUsers: invitedData,
      };
      console.log('postDirectMessages');
      console.log(body);
      dispatch(postDirectMessages(token, body));
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

const mapDispatchToProps = { postDirectMessages };

export default connect(null, mapDispatchToProps)(DirectMessages);
