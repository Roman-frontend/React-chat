import React, { useMemo } from 'react';
import { useQuery, useMutation, useReactiveVar } from '@apollo/client';
import { useSnackbar } from 'notistack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AssignmentIndSharpIcon from '@mui/icons-material/AssignmentIndSharp';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import DeleteIcon from '@mui/icons-material/Delete';
import { CHANNELS, REMOVE_CHANNEL } from '../SetsUserGraphQL/queryes';
import { activeChatId, reactiveVarId } from '../../../GraphQLApp/reactiveVars';

const ChannelsRightBar = (props) => {
  const { data: channels } = useQuery(CHANNELS);
  const activeChannelId = useReactiveVar(activeChatId).activeChannelId;
  const userId = useReactiveVar(reactiveVarId);
  const { enqueueSnackbar } = useSnackbar();

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
      enqueueSnackbar('Direct Message isn`t removed!', { variant: 'error' });
    },
    onCompleted(data) {
      enqueueSnackbar('Channel is a success removed!', {
        variant: 'success',
      });
    },
  });

  return (
    <List>
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

export default React.memo(ChannelsRightBar);
