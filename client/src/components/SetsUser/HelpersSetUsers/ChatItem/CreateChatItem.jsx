import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Button } from '@material-ui/core';
//import Button from '@material-ui/core/Button';
import { createChannelName } from './ChatName.jsx';
import {
  styles,
  styleActiveLink,
  styleIsNotActiveLink,
} from './ChatStyles.jsx';
import { AUTH, CHANNELS, REMOVE_CHANNEL } from '../../../GraphQL/queryes';
import { useQuery, useMutation, useReactiveVar } from '@apollo/client';
import {
  reactiveActiveChannelId,
  reactiveActiveDirrectMessageId,
} from '../../../GraphQL/reactiveVariables';

export const CreateLists = withStyles(styles)((props) => {
  const { reqRowElements, listName, classes } = props;
  const { data: auth } = useQuery(AUTH);
  const { data: queryChannels } = useQuery(CHANNELS);
  const [focusedId, setFocusedId] = useState(false);
  const activeChannelId = useReactiveVar(reactiveActiveChannelId);

  const [removeChannel] = useMutation(REMOVE_CHANNEL, {
    update: (cache) => {
      cache.modify({
        fields: {
          userChannels({ DELETE }) {
            return DELETE;
          },
          messages({ DELETE }) {
            return DELETE;
          },
        },
      });
    },
    onCompleted(data) {
      console.log(`remove chat ${data}`);
    },
    onError(error) {
      console.log(`Помилка при видаленні повідомлення ${error}`);
    },
  });

  function createLink(linkData, listName) {
    const id = linkData.id;
    const name = createChannelName(linkData.isPrivate, linkData);

    return (
      <div
        key={id}
        id={id}
        onMouseEnter={() => setFocusedId(id)}
        onMouseLeave={() => setFocusedId(false)}
        className='main-font chatHover'
        style={activeChannelId === id ? styleActiveLink : styleIsNotActiveLink}
      >
        <Grid container style={{ alignItems: 'center' }}>
          <Grid item xs={10} onClick={() => toActive(id)}>
            {name}
          </Grid>
          <Grid
            item
            xs={2}
            style={{ display: focusedId === id ? 'flex' : 'none' }}
          >
            <Button
              variant='outlined'
              color='primary'
              size='small'
              style={{ background: 'white' }}
              classes={{ root: classes.buttonRoot }}
              onClick={() => showMore(id, listName)}
            >
              X
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }

  function showMore(id) {
    if (
      auth &&
      auth.id &&
      auth.token &&
      auth.channels &&
      queryChannels &&
      queryChannels.channels &&
      queryChannels.channels[0]
    ) {
      removeChannel({
        variables: { channelId: id, userId: auth.id, token: auth.token },
      });
    }
    toActive(queryChannels.channels[0].id);
  }

  async function toActive(resId) {
    if (queryChannels && queryChannels.channels) {
      const activeId = queryChannels.channels.find((id) => id === resId);
      if (activeId) {
        reactiveActiveChannelId(activeId);
        reactiveActiveDirrectMessageId(null);
      } else {
        reactiveActiveChannelId(null);
        reactiveActiveDirrectMessageId(resId);
      }
    }
  }

  let allDirectMessages = [];
  reqRowElements.forEach((channel) => {
    if (channel && channel.id) {
      allDirectMessages.push(createLink(channel, listName));
    }
  });

  return allDirectMessages;
});
