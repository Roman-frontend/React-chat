import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Button } from '@material-ui/core';
//import Button from '@material-ui/core/Button';
import { CreateChannelName } from '../HelpersSetUsers/ChatName.jsx';
import {
  styles,
  styleActiveLink,
  styleIsNotActiveLink,
} from '../HelpersSetUsers/ChatStyles.jsx';
import { REMOVE_CHANNEL } from '../SetsUserGraphQL/queryes';
import { useMutation, useReactiveVar } from '@apollo/client';
import { activeChatId, reactiveVarId } from '../../../GraphQLApp/reactiveVars';

export const CreateChannels = withStyles(styles)((props) => {
  const { channels, classes } = props;
  const userId = useReactiveVar(reactiveVarId);
  const [focusedId, setFocusedId] = useState(false);
  const activeChannelId = useReactiveVar(activeChatId).activeChannelId;

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
    onError(error) {
      console.log(`Помилка при видаленні повідомлення ${error}`);
    },
  });

  function create(id, isPrivate, name) {
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
          <Grid
            item
            xs={10}
            onClick={() => activeChatId({ activeChannelId: id })}
          >
            <CreateChannelName isPrivate={isPrivate} name={name} />
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
              onClick={() =>
                removeChannel({ variables: { channelId: id, userId } })
              }
            >
              X
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }

  return channels.map((channel) => {
    if (channel) {
      return create(channel.id, channel.isPrivate, channel.name);
    }
  });
});
