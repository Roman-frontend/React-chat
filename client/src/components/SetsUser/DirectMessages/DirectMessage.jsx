import React, { memo } from 'react';
import { useQuery, useReactiveVar } from '@apollo/client';
import { withStyles } from '@mui/styles';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { styles } from '../HelpersSetUsers/SetUsersStyles.jsx';
import { activeChatId, reactiveVarId } from '../../../GraphQLApp/reactiveVars';
import { GET_USERS } from '../../../GraphQLApp/queryes';
import { determineActiveChat } from '../../Helpers/determineActiveChat';

export const DirectMessage = withStyles(styles)(
  memo((props) => {
    const { drMsg, key } = props;
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
          key={key}
          onClick={() => activeChatId({ activeDirectMessageId: drMsg.id })}
          selected={activeDirectMessageId === drMsg.id && true}
        >
          <ListItemText style={{ textAlign: 'center' }} primary={name} />
        </ListItem>
      );
    }
    return true;
  })
);
