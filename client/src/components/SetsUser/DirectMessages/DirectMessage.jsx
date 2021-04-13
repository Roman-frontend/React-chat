import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connect } from 'react-redux';
import { useAuth } from '../../../hooks/auth.hook.js';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Button } from '@material-ui/core';
import { removeDirectMessages } from '../../../redux/actions/actions';
import { ACTIVE_CHAT_ID } from '../../../redux/types';
import { createDirectMsgName } from './ChatName.jsx';
import {
  styles,
  styleActiveLink,
  styleIsNotActiveLink,
} from './ChatStyles.jsx';

export const CreateLists = withStyles(styles)((props) => {
  const { reqRowElements, classes } = props;
  const { changeStorage } = useAuth();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userData);
  const userId = useSelector((state) => state.userData._id);
  const token = useSelector((state) => state.token);
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
    if (token && userData && userData.directMessages) {
      const filteredUserDirectMessages = userData.directMessages.filter(
        (directMessageId) => {
          return directMessageId !== id;
        }
      );
      if (Array.isArray(filteredUserDirectMessages)) {
        const body = { userId, filteredUserDirectMessages };
        dispatch(removeDirectMessages(token, id, { ...body }));
      }
    }
  }

  function toActive(idActive) {
    changeStorage({ lastActiveChatId: idActive });
    const payload = {
      activeChannelId: null,
      activeDirectMessageId: idActive,
    };
    dispatch({ type: ACTIVE_CHAT_ID, payload });
  }

  return reqRowElements.map((element) => createLink(element));
});

const mapDispatchToProps = { removeDirectMessages };

export default connect(null, mapDispatchToProps)(CreateLists);
