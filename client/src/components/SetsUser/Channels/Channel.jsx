import React from 'react';
import { useReactiveVar } from '@apollo/client';
import { withStyles, makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { styles } from '../HelpersSetUsers/SetUsersStyles.jsx';
import { activeChatId } from '../../../GraphQLApp/reactiveVars';

export const Channel = withStyles(styles)((props) => {
  const { channel, key } = props;
  const theme = useTheme();
  const activeChannelId = useReactiveVar(activeChatId).activeChannelId;

  if (typeof channel === 'object' && channel !== null) {
    return (
      <ListItem
        button
        key={key}
        onClick={() => activeChatId({ activeChannelId: channel.id })}
        selected={activeChannelId === channel.id && true}
      >
        <ListItemText style={{ textAlign: 'center' }} primary={channel.name} />
      </ListItem>
    );
  }
  return true;
});
