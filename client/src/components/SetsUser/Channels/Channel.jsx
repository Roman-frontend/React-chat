import React from 'react';
import { useReactiveVar } from '@apollo/client';
import { useTheme } from '@mui/material/styles';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import { activeChatId } from '../../../GraphQLApp/reactiveVars';

export const Channel = (props) => {
  const { channel, isOpenLeftBar } = props;
  const activeChannelId = useReactiveVar(activeChatId).activeChannelId;
  const theme = useTheme();

  if (typeof channel === 'object' && channel !== null) {
    return (
      <ListItem
        button
        sx={{
          '&.Mui-selected': {
            background: theme.palette.action.active,
            color: theme.palette.leftBarItem.contrastText,
            '&:hover': {
              background: theme.palette.action.active,
            },
          },
        }}
        onClick={() => activeChatId({ activeChannelId: channel.id })}
        selected={activeChannelId === channel.id && true}
      >
        <>
          <Avatar alt={channel.name} size='small'>
            {channel.name[0]}
          </Avatar>
          {isOpenLeftBar && (
            <ListItemText
              primary={channel.name}
              style={{ textAlign: 'center' }}
            />
          )}
        </>
      </ListItem>
    );
  }
  return null;
};
