import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { DrawTitles } from '../DrawTitles.jsx';
import { AddChannel } from '../../Modals/AddChannel/AddChannel';
import { Channel } from './Channel';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';

import { colors } from '@material-ui/core';
import { useQuery, useReactiveVar } from '@apollo/client';
import { CHANNELS } from '../../SetsUser/SetsUserGraphQL/queryes';
import {
  reactiveVarId,
  reactiveVarToken,
} from '../../../GraphQLApp/reactiveVars';

//На майбутнє іконка груп
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';

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
  const authId = useReactiveVar(reactiveVarId);
  const authToken = useReactiveVar(reactiveVarToken);
  const [listChannelsIsOpen, setListChannelsIsOpen] = useState(true);
  const [modalAddChannelIsOpen, setModalAddChannelIsOpen] = useState(false);
  const [open, setOpen] = useState(true);

  return (
    <>
      <div>
        <List component='nav' className={classes.root}>
          <ListItem button onClick={() => setOpen(!open)}>
            <ListItemIcon>
              <SupervisedUserCircleIcon color='action' />
            </ListItemIcon>
            <ListItemText primary={t('description.channelTitle')} />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
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
        variant='contained'
        color='primary'
        size='small'
        style={{ background: colors.indigo[500], width: '100%' }}
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
