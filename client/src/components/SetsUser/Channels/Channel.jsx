import React from 'react';
import { useReactiveVar } from '@apollo/client';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { styles } from '../HelpersSetUsers/SetUsersStyles.jsx';
import { activeChatId } from '../../../GraphQLApp/reactiveVars';

export const Channel = withStyles(styles)((props) => {
  const { isOpenLeftBar, channel } = props;
  const activeChannelId = useReactiveVar(activeChatId).activeChannelId;

  if (typeof channel === 'object' && channel !== null) {
    return (
      <ListItem
        button
        key={channel.id}
        onClick={() => activeChatId({ activeChannelId: channel.id })}
        selected={activeChannelId === channel.id && true}
      >
        <ListItemText style={{ textAlign: 'center' }} primary={channel.name} />
      </ListItem>
    );
  }
  return true;
});
