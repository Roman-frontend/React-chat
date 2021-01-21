import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useReactiveVar } from '@apollo/client';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Button } from '@material-ui/core';
import { createDirectMsgName } from './ChatName.jsx';
import {
  styles,
  styleActiveLink,
  styleIsNotActiveLink,
} from './ChatStyles.jsx';
import {
  activeChatId,
  reactiveVarId,
} from '../../../GraphQLApp/reactiveVariables';
import { AUTH, REMOVE_CHAT } from '../../../GraphQLApp/queryes';

export const DirectMessage = withStyles(styles)((props) => {
  const { reqRowElements, classes } = props;
  const { data: auth } = useQuery(AUTH);
  const [focusedId, setFocusedId] = useState(false);
  const authId = useReactiveVar(reactiveVarId);
  const activeDirectMessageId = useReactiveVar(activeChatId)
    .activeDirectMessageId;

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

  function createLink(id, name) {
    const readyName = createDirectMsgName(name);

    return (
      <div
        key={id}
        id={id}
        onMouseEnter={() => setFocusedId(id)}
        onMouseLeave={() => setFocusedId(false)}
        onClick={() => activeChatId({ activeDirectMessageId: id })}
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
            {readyName}
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

  return reqRowElements.map((directMsg) => {
    const name =
      directMsg.inviter.id !== authId
        ? directMsg.inviter.name
        : directMsg.invited.name;
    return createLink(directMsg.id, name);
  });
});
