import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useReactiveVar } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import { CHANNELS } from '../../SetsUser/SetsUserGraphQL/queryes';
import { AddChannel } from '../../Modals/AddChannel/AddChannel';
import { Channel } from './Channel';
import {
  reactiveVarId,
  reactiveVarToken,
} from '../../../GraphQLApp/reactiveVars';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export function Channels(props) {
  const { isOpenLeftBar, setAlertData } = props;
  const classes = useStyles();
  const { t } = useTranslation();
  const { data: allChannels } = useQuery(CHANNELS);
  const [modalAddChannelIsOpen, setModalAddChannelIsOpen] = useState(false);
  const [open, setOpen] = useState(true);

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
                <SupervisedUserCircleIcon color='action' />
              </ListItemIcon>
              <ListItemText
                style={{ textAlign: 'center' }}
                primary={t('description.channelTitle')}
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
                <SupervisedUserCircleIcon color='action' />
              </ListItemIcon>
            </ListItem>
          )}
          <Collapse in={open} timeout='auto' unmountOnExit>
            <List>
              {allChannels &&
                allChannels.userChannels.map((channel) => (
                  <Channel
                    channel={channel}
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
        onClick={() => setModalAddChannelIsOpen(true)}
      >
        {isOpenLeftBar ? '+ Add Channel' : '+'}
      </Button>
      <AddChannel
        modalAddChannelIsOpen={modalAddChannelIsOpen}
        setModalAddChannelIsOpen={setModalAddChannelIsOpen}
        setAlertData={props.setAlertData}
      />
    </>
  );
}
