import React from 'react';
import { useReactiveVar } from '@apollo/client';
import { nanoid } from 'nanoid';
import { withStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import { styles } from '../HelpersSetUsers/SetUsersStyles.jsx';
import { activeChatId } from '../../../GraphQLApp/reactiveVars';

export const Channel = withStyles(styles)((props) => {
  const { channel, key, isOpenLeftBar } = props;
  const activeChannelId = useReactiveVar(activeChatId).activeChannelId;
  const theme = useTheme();

  if (typeof channel === 'object' && channel !== null) {
    return (
      <ListItem
        button
        key={key}
        sx={{
          '& .Mui-selected': {
            backgroundColor: 'red',
          },
        }}
        onClick={() => activeChatId({ activeChannelId: channel.id })}
        selected={activeChannelId === channel.id && true}
      >
        {isOpenLeftBar ? (
          <>
            <Avatar alt={channel.name} size='small'>
              {channel.name[0]}
            </Avatar>
            <ListItemText
              primary={channel.name}
              style={{ textAlign: 'center' }}
            />
          </>
        ) : (
          <Avatar alt={channel.name} size='small'>
            {channel.name[0]}
          </Avatar>
        )}
      </ListItem>
    );
  }
  return null;
});
