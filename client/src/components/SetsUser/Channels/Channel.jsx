import React, { useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import GroupIcon from '@material-ui/icons/Group';
import Button from '@material-ui/core/Button';
import { styles } from '../HelpersSetUsers/SetUsersStyles.jsx';
import { REMOVE_CHANNEL } from '../SetsUserGraphQL/queryes';
import { useMutation, useReactiveVar } from '@apollo/client';
import { activeChatId, reactiveVarId } from '../../../GraphQLApp/reactiveVars';

const useStyles = makeStyles((theme) => ({
  buttonRoot: {
    padding: 0,
    width: '17px',
    height: '17px',
    minWidth: 0,
    background: 'white',
  },
}));

export const Channel = withStyles(styles)((props) => {
  const { isOpenLeftBar, setAlertData, channel } = props;
  const classes = useStyles();
  const userId = useReactiveVar(reactiveVarId);
  const activeChannelId = useReactiveVar(activeChatId).activeChannelId;

  if (typeof channel === 'object' && channel !== null) {
    console.log(activeChannelId === channel.id, isOpenLeftBar);
    return (
      <ListItem
        button
        key={channel.id}
        onClick={() => activeChatId({ activeChannelId: channel.id })}
        selected={activeChannelId === channel.id && true}
      >
        <ListItemIcon>
          <GroupIcon
            style={{
              background: 'cadetblue',
              borderRadius: '0.4rem',
            }}
          />
        </ListItemIcon>
        <ListItemText primary={channel.name} />
      </ListItem>
    );
  }
  return true;
});
