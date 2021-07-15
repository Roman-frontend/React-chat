import React, { useMemo } from 'react';
import { useQuery, useMutation, useReactiveVar } from '@apollo/client';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import Avatar from '@material-ui/core/Avatar';
import MailIcon from '@material-ui/icons/Mail';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import AssignmentIndSharpIcon from '@material-ui/icons/AssignmentIndSharp';
import PersonIcon from '@material-ui/icons/Person';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DeleteIcon from '@material-ui/icons/Delete';
import { AUTH, GET_USERS } from '../../../GraphQLApp/queryes';
import {
  GET_DIRECT_MESSAGES,
  REMOVE_DIRECT_MESSAGE,
} from '../SetsUserGraphQL/queryes';
import { activeChatId } from '../../../GraphQLApp/reactiveVars';
import { determineActiveChat } from '../../Helpers/determineActiveChat';

const DirectMessageRightBar = (props) => {
  const { setAlertData, setIsOpenRightBarDrMsg } = props;
  const { data: auth } = useQuery(AUTH);
  const { data: users } = useQuery(GET_USERS);
  const { data: directMessages } = useQuery(GET_DIRECT_MESSAGES);
  const activeDirectMessageId =
    useReactiveVar(activeChatId).activeDirectMessageId;

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
      setAlertData(data.directMessages.remove);
      setIsOpenRightBarDrMsg(false);
    },
    onError(error) {
      console.log(`Помилка при видаленні повідомлення ${error}`);
    },
  });

  return (
    <List>
      <ListItem button onClick={() => setIsOpenRightBarDrMsg(false)}>
        <ListItemIcon>
          <ChevronRightIcon />
        </ListItemIcon>
      </ListItem>
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
      <ListItem button>
        <ListItemIcon>
          <DeleteIcon />
        </ListItemIcon>
        <ListItemText
          primary='Remove chat'
          onClick={() =>
            removeDirectMessage({ variables: { id: activeDirectMessageId } })
          }
        />
      </ListItem>
    </List>
  );
};

export default React.memo(DirectMessageRightBar);
