import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useReactiveVar } from '@apollo/client';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Button } from '@material-ui/core';
import { CreateDirectMsgName } from '../HelpersSetUsers/ChatName.jsx';
import {
  styles,
  styleActiveLink,
  styleIsNotActiveLink,
} from '../HelpersSetUsers/ChatStyles.jsx';
import { activeChatId, reactiveVarId } from '../../../GraphQLApp/reactiveVars';
import { AUTH, GET_USERS } from '../../../GraphQLApp/queryes';
import { REMOVE_CHAT } from '../SetsUserGraphQL/queryes';
import { determineActiveChat } from '../../Helpers/determineActiveChat';

export const DirectMessage = withStyles(styles)((props) => {
  const { reqRowElements, classes } = props;
  const { data: auth } = useQuery(AUTH);
  const { data: allUsers } = useQuery(GET_USERS);
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
      console.log(`Помилка при видаленні повідомлення ${error}`);
    },
  });

  function createLink(id, name) {
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
            <CreateDirectMsgName name={name} />
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
      removeDirectMessage({ variables: { id, token: auth.token } });
    }
  }

  return reqRowElements.map((directMsg) => {
    const name = determineActiveChat(directMsg, allUsers.users, authId);
    return createLink(directMsg.id, name);
  });
});
