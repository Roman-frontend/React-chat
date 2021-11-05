import React, { useMemo } from 'react';
import { useQuery, useMutation, useReactiveVar } from '@apollo/client';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AssignmentIndSharpIcon from '@mui/icons-material/AssignmentIndSharp';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import { AUTH, GET_USERS } from '../../../GraphQLApp/queryes';
import {
  GET_DIRECT_MESSAGES,
  REMOVE_DIRECT_MESSAGE,
} from '../SetsUserGraphQL/queryes';
import { activeChatId } from '../../../GraphQLApp/reactiveVars';
import { determineActiveChat } from '../../Helpers/determineActiveChat';
import { useSnackbar } from 'notistack';

const DirectMessageRightBar = (props) => {
  const { data: auth } = useQuery(AUTH);
  const { data: users } = useQuery(GET_USERS);
  const { data: directMessages } = useQuery(GET_DIRECT_MESSAGES);
  const activeDirectMessageId =
    useReactiveVar(activeChatId).activeDirectMessageId;
  const { enqueueSnackbar } = useSnackbar();

  const activeDirectMessage = useMemo(() => {
    if (
      activeDirectMessageId &&
      directMessages &&
      Array.isArray(directMessages.directMessages)
    ) {
      return directMessages.directMessages.find(
        (drMsg) => drMsg !== null && drMsg.id === activeDirectMessageId
      );
    }
  }, [activeDirectMessageId, directMessages]);

  const name = useMemo(() => {
    if (activeDirectMessage) {
      return determineActiveChat(activeDirectMessage, users.users, auth.id);
    }
    return '#generall';
  }, [activeDirectMessage]);

  const [removeDirectMessage] = useMutation(REMOVE_DIRECT_MESSAGE, {
    update: (cache, { data: { directMessages } }) => {
      cache.modify({
        fields: {
          directMessages(existingDirectMessagesRefs, { readField }) {
            return existingDirectMessagesRefs.filter(
              (directMessageRef) =>
                directMessages.remove.recordId !==
                readField('id', directMessageRef)
            );
          },
          messages({ DELETE }) {
            return DELETE;
          },
        },
      });
    },
    onCompleted(data) {
      console.log(data);
      enqueueSnackbar('Direct Message is a success removed!', {
        variant: 'success',
      });
      activeChatId({});
    },
    onError(error) {
      console.log(`Помилка при видаленні повідомлення ${error}`);
      enqueueSnackbar('Direct Message isn`t removed!', { variant: 'error' });
    },
  });

  return (
    <List>
      <ListItem button>
        <ListItemIcon>
          <PersonIcon
            style={{
              background: 'cadetblue',
              borderRadius: '50%',
              fontSize: 40,
              cursor: 'pointer',
            }}
          />
        </ListItemIcon>
        <ListItemText primary={name} />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <PersonIcon />
        </ListItemIcon>
        <ListItemText primary='Profile' />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <AssignmentIndSharpIcon />
        </ListItemIcon>
        <ListItemText primary='My Acount' />
      </ListItem>
      <ListItem
        button
        onClick={() =>
          removeDirectMessage({ variables: { id: activeDirectMessageId } })
        }
      >
        <ListItemIcon>
          <DeleteIcon />
        </ListItemIcon>
        <ListItemText primary='Remove chat' />
      </ListItem>
    </List>
  );
};

export default React.memo(DirectMessageRightBar);
