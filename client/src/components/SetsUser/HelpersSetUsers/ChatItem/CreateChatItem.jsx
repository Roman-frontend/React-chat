import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Button } from '@material-ui/core';
//import Button from '@material-ui/core/Button';
import { removeChannel } from '../../../../redux/actions/actions';
import { createChannelName } from './ChatName.jsx';
import {
  styles,
  styleActiveLink,
  styleIsNotActiveLink,
} from './ChatStyles.jsx';
import { AUTH, CHANNELS } from '../../../GraphQL/queryes';
import { useQuery, useReactiveVar } from '@apollo/client';
import {
  reactiveActiveChannelId,
  reactiveActiveDirrectMessageId,
} from '../../../GraphQL/reactiveVariables';

export const CreateLists = withStyles(styles)((props) => {
  const { reqRowElements, listName, classes } = props;
  const dispatch = useDispatch();
  const { data: auth } = useQuery(AUTH);
  const { data: queryChannels } = useQuery(CHANNELS);
  const [focusedId, setFocusedId] = useState(false);
  const activeChannelId = useReactiveVar(reactiveActiveChannelId);

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
      auth.token &&
      auth.channels &&
      queryChannels &&
      queryChannels.channels &&
      queryChannels.channels[0]
    ) {
      const channel = queryChannels.channels.filter(
        (channel) => channel.id === id
      )[0];
      const filteredChannelMembers = channel.members.filter(
        (id) => id !== auth.id
      );
      const filteredUserChannels = auth.channels.filter(
        (channelId) => channelId !== id
      );
      const body = {
        userId: auth.id,
        filteredChannelMembers,
        filteredUserChannels,
      };
      dispatch(removeChannel(auth.token, id, { ...body }));
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
  reqRowElements.forEach((element) =>
    allDirectMessages.push(createLink(element, listName))
  );

  return allDirectMessages;
});

const mapDispatchToProps = { removeChannel };

export default connect(null, mapDispatchToProps)(CreateLists);
