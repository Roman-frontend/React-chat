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
import GroupIcon from '@material-ui/icons/Group';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DeleteIcon from '@material-ui/icons/Delete';
import { AUTH, GET_USERS } from '../../../GraphQLApp/queryes';
import {
  CHANNELS,
  GET_DIRECT_MESSAGES,
  REMOVE_DIRECT_MESSAGE,
  REMOVE_CHANNEL,
} from '../SetsUserGraphQL/queryes';
import { activeChatId, reactiveVarId } from '../../../GraphQLApp/reactiveVars';
import { determineActiveChat } from '../../Helpers/determineActiveChat';

const DirectMessageRightBar = (props) => {
  const {
    setAlertData,
    setIsOpenRightBarDrMsg,
    isOpenRightBarChannels,
    setIsOpenRightBarChannels,
  } = props;
  const { data: auth } = useQuery(AUTH);
  const { data: users } = useQuery(GET_USERS);
  const { data: channels } = useQuery(CHANNELS);
  const activeChannelId = useReactiveVar(activeChatId).activeChannelId;
  const userId = useReactiveVar(reactiveVarId);

  const activeChannel = useMemo(() => {
    if (activeChannelId && channels && Array.isArray(channels.userChannels)) {
      return channels.userChannels.find(
        (channel) => channel !== null && channel.id === activeChannelId
      );
    }
  }, [activeChannelId, channels]);

  const [removeChannel] = useMutation(REMOVE_CHANNEL, {
    update: (cache, { data: { channel } }) => {
      cache.modify({
        fields: {
          userChannels(existingChannelRefs, { readField }) {
            return existingChannelRefs.filter(
              (channelRef) =>
                channel.remove.recordId !== readField('id', channelRef)
            );
          },
          /* messages(existingMessagesRef, { readField }) {
            console.log(existingMessagesRef);
            //return DELETE;
            return existingMessagesRef.filter(
              (messageRef) => channel.remove.id !== readField('id', messageRef)
            );
          }, */
          messages({ DELETE }) {
            return DELETE;
          },
        },
      });
    },
    onError(error) {
      console.log(`Помилка при видаленні повідомлення ${error}`);
    },
    onCompleted(data) {
      setAlertData(data.channel.remove);
    },
  });

  return (
    <List>
      <ListItem button onClick={() => setIsOpenRightBarChannels(false)}>
        <ListItemIcon>
          <ChevronRightIcon />
        </ListItemIcon>
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <GroupIcon
            style={{
              background: 'cadetblue',
              borderRadius: '50%',
            }}
          />
        </ListItemIcon>
        <ListItemText
          primary={activeChannel ? activeChannel.name : '#general'}
        />
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
          primary='Remove channel'
          onClick={() =>
            removeChannel({ variables: { channelId: activeChannelId, userId } })
          }
        />
      </ListItem>
    </List>
  );
};

export default React.memo(DirectMessageRightBar);
