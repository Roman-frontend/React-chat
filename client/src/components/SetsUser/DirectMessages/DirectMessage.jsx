import React, { useState, useRef } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Button } from '@material-ui/core';
import { createDirectMsgName } from './ChatName.jsx';
import {
  styles,
  styleActiveLink,
  styleIsNotActiveLink,
} from './ChatStyles.jsx';
import {
  reactiveActiveChannelId,
  reactiveActiveDirrectMessageId,
} from '../../../GraphQLApp/reactiveVariables';
import { AUTH, REMOVE_CHAT } from '../../../GraphQLApp/queryes';
import { useQuery, useMutation, useReactiveVar } from '@apollo/client';

export const DirectMessage = withStyles(styles)((props) => {
  const { reqRowElements, classes } = props;
  const { data: auth } = useQuery(AUTH);
  const [focusedId, setFocusedId] = useState(false);
  const activeDirectMessageId = useReactiveVar(reactiveActiveDirrectMessageId);

  const [removeDirectMessage] = useMutation(REMOVE_CHAT, {
    update: (cache) => {
      cache.modify({
        fields: {
          directMessages({ DELETE }) {
            return DELETE;
          },
          messages({ DELETE }) {
            return DELETE;
          },
        },
      });
    },
    onCompleted(data) {
      //console.log(`remove chat ${data}`);
    },
    onError(error) {
      //console.log(`Помилка при видаленні повідомлення ${error}`);
    },
  });

  function createLink(linkData) {
    const id = linkData.id;
    const name = createDirectMsgName(linkData.invited.name);

    return (
      <div
        key={id}
        id={id}
        onMouseEnter={() => setFocusedId(id)}
        onMouseLeave={() => setFocusedId(false)}
        onClick={() => toActive(id)}
        className='main-font chatHover'
        style={
          activeDirectMessageId === id ? styleActiveLink : styleIsNotActiveLink
        }
      >
        <Grid
          container
          style={{
            alignItems: 'center',
          }}
        >
          <Grid item xs={10}>
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
              onClick={() => showMore(id)}
            >
              X
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }

  function showMore(id) {
    if (auth && auth.token) {
      removeDirectMessage({ variables: { id, chatType: 'DirectMessage' } });
    }
  }

  function toActive(idActive) {
    reactiveActiveChannelId(null);
    reactiveActiveDirrectMessageId(idActive);
  }

  return reqRowElements.map((element) => createLink(element));
});
