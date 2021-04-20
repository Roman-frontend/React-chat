import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Button } from '@material-ui/core';
import { removeDirectMessages } from '../../../redux/actions/actions';
import { createDirectMsgName } from './ChatName.jsx';
import {
  styles,
  styleActiveLink,
  styleIsNotActiveLink,
} from './ChatStyles.jsx';
import {
  reactiveActiveChannelId,
  reactiveActiveDirrectMessageId,
} from '../../GraphQL/reactiveVariables';
import { AUTH } from '../../GraphQL/queryes';
import { useQuery } from '@apollo/client';

export const CreateLists = withStyles(styles)((props) => {
  const { reqRowElements, classes } = props;
  const dispatch = useDispatch();
  const { data: auth } = useQuery(AUTH);
  const [focusedId, setFocusedId] = useState(false);
  const [activeId, setActiveId] = useState(false);

  function createLink(linkData) {
    const id = linkData.id;
    const name = createDirectMsgName(linkData.invited.name);

    return (
      <div
        key={id}
        id={id}
        onMouseEnter={() => setFocusedId(id)}
        onMouseLeave={() => setFocusedId(false)}
        onClick={() => setActiveId(id)}
        className='main-font chatHover'
        style={activeId === id ? styleActiveLink : styleIsNotActiveLink}
      >
        <Grid
          container
          style={{
            alignItems: 'center',
          }}
        >
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
    if (
      auth &&
      auth.token &&
      auth.directMessagesId &&
      auth.directMessagesId[0]
    ) {
      const filteredUserDirectMessages = auth.directMessagesId.filter(
        (directMessageId) => {
          return directMessageId !== id;
        }
      );
      if (Array.isArray(filteredUserDirectMessages)) {
        const body = { userId: auth.id, filteredUserDirectMessages };
        dispatch(removeDirectMessages(auth.token, id, { ...body }));
      }
    }
  }

  function toActive(idActive) {
    reactiveActiveChannelId(null);
    reactiveActiveDirrectMessageId(idActive);
  }

  return reqRowElements.map((element) => createLink(element));
});

const mapDispatchToProps = { removeDirectMessages };

export default connect(null, mapDispatchToProps)(CreateLists);
