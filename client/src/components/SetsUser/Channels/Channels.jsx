import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import { CHANNELS } from '../../SetsUser/SetsUserGraphQL/queryes';
import { AddChannel } from '../../Modals/AddChannel/AddChannel';
import { Channel } from './Channel';
import { nanoid } from 'nanoid';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
  },
}));

export function Channels(props) {
  const {
    isOpenLeftBar,
    modalAddChannelIsOpen,
    setModalAddChannelIsOpen,
    isErrorInPopap,
    setIsErrorInPopap,
  } = props;
  const classes = useStyles();
  const { t } = useTranslation();
  const { data: allChannels } = useQuery(CHANNELS);
  const [open, setOpen] = useState(true);

  return (
    <>
      <div>
        <List component='nav' className={classes.root}>
          {isOpenLeftBar ? (
            <ListItem
              key={nanoid()}
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
              key={nanoid()}
              style={{ padding: 0, margin: 0, justifyContent: 'center' }}
              button
              onClick={() => setOpen(!open)}
            >
              <ListItemIcon style={{ padding: '0', justifyContent: 'center' }}>
                <SupervisedUserCircleIcon color='action' />
              </ListItemIcon>
            </ListItem>
          )}
          {allChannels ? (
            <Collapse in={open} timeout='auto' unmountOnExit>
              <List>
                {allChannels.userChannels.map((channel) =>
                  channel ? (
                    <React.Fragment key={channel.id}>
                      <Channel
                        channel={channel}
                        key={channel.id}
                        isOpenLeftBar={isOpenLeftBar}
                      />
                    </React.Fragment>
                  ) : null
                )}
              </List>
            </Collapse>
          ) : null}
        </List>
      </div>
      <Button
        size='small'
        style={{
          width: '100%',
          padding: 0,
        }}
        color='warning'
        onClick={() => setModalAddChannelIsOpen(true)}
      >
        {isOpenLeftBar ? '+ Add Channel' : '+'}
      </Button>
      <AddChannel
        modalAddChannelIsOpen={modalAddChannelIsOpen}
        setModalAddChannelIsOpen={setModalAddChannelIsOpen}
        isErrorInPopap={isErrorInPopap}
        setIsErrorInPopap={setIsErrorInPopap}
      />
    </>
  );
}
