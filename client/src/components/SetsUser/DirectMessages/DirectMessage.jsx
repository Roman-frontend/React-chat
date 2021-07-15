import React, { useState, memo } from 'react';
import { useQuery, useMutation, useReactiveVar } from '@apollo/client';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { styles } from '../HelpersSetUsers/SetUsersStyles.jsx';
import { activeChatId, reactiveVarId } from '../../../GraphQLApp/reactiveVars';
import { GET_USERS } from '../../../GraphQLApp/queryes';
import { determineActiveChat } from '../../Helpers/determineActiveChat';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import PersonIcon from '@material-ui/icons/Person';

const useStyles = makeStyles((theme) => ({
  buttonRoot: {
    padding: 0,
    width: '17px',
    height: '17px',
    minWidth: 0,
    background: 'white',
  },
}));

export const DirectMessage = withStyles(styles)(
  memo((props) => {
    const { drMsg, isOpenLeftBar } = props;
    const classes = useStyles();
    const { data: users } = useQuery(GET_USERS);
    const authId = useReactiveVar(reactiveVarId);
    const activeDirectMessageId =
      useReactiveVar(activeChatId).activeDirectMessageId;

    if (
      typeof drMsg === 'object' &&
      drMsg !== null &&
      users &&
      Array.isArray(users.users)
    ) {
      const name = determineActiveChat(drMsg, users.users, authId);
      return (
        <ListItem
          button
          key={drMsg.id}
          onClick={() => activeChatId({ activeDirectMessageId: drMsg.id })}
          selected={activeDirectMessageId === drMsg.id && true}
        >
          <ListItemIcon>
            <PersonIcon
              style={{
                background: 'cadetblue',
                borderRadius: '0.4rem',
              }}
            />
          </ListItemIcon>
          <ListItemText primary={name} />
        </ListItem>
      );
    }
    return true;
  })
);
