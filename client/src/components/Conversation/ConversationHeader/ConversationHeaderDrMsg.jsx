import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import PersonIcon from '@mui/icons-material/Person';
import { Drawer, Box } from '@mui/material';
import './ConversationHeader.sass';
import { useQuery, useReactiveVar } from '@apollo/client';
import { AUTH, GET_USERS } from '../../../GraphQLApp/queryes';
import { GET_DIRECT_MESSAGES } from '../../SetsUser/SetsUserGraphQL/queryes';
import { activeChatId } from '../../../GraphQLApp/reactiveVars';
import { determineActiveChat } from '../../Helpers/determineActiveChat';
import DirectMessageRightBar from '../../SetsUser/DirectMessages/DirectMessageRightBar';

export const ConversationHeaderDrMsg = (props) => {
  const theme = useTheme();
  const { data: auth } = useQuery(AUTH);
  const { data: listDirectMessages } = useQuery(GET_DIRECT_MESSAGES);
  const { data: allUsers } = useQuery(GET_USERS);
  const activeDirectMessageId =
    useReactiveVar(activeChatId).activeDirectMessageId;
  const [isOpenRightBarDrMsg, setIsOpenRightBarDrMsg] = useState(false);

  function createName() {
    if (
      activeDirectMessageId &&
      listDirectMessages &&
      Array.isArray(listDirectMessages.directMessages) &&
      listDirectMessages.directMessages[0] &&
      allUsers &&
      Array.isArray(allUsers.users) &&
      allUsers.users[0]
    ) {
      const activeDirectMessage = listDirectMessages.directMessages.find(
        (directMessage) => {
          return directMessage.id === activeDirectMessageId;
        }
      );
      if (activeDirectMessage && auth && auth.id) {
        const name = determineActiveChat(
          activeDirectMessage,
          allUsers.users,
          auth.id
        );
        return <b className='conversation__name'>✩ {name}</b>;
      }
      return '#general';
    }
  }

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setIsOpenRightBarDrMsg(open);
  };

  return (
    <div style={{ background: theme.palette.primary.main }}>
      <Grid
        container
        spacing={1}
        style={{ alignItems: 'center', height: '4.3rem', padding: '0vh 1vw' }}
        justify='space-between'
      >
        <Grid item xs={10}>
          {createName()}
        </Grid>
        <Grid item xs={2}>
          <IconButton
            edge='end'
            aria-label='account of current user'
            aria-haspopup='true'
            color='inherit'
            onClick={toggleDrawer(true)}
          >
            <PersonIcon
              style={{
                background: 'cadetblue',
                borderRadius: '50%',
                fontSize: 40,
                cursor: 'pointer',
              }}
            />
          </IconButton>
        </Grid>
      </Grid>
      <div>
        <React.Fragment>
          <Drawer
            sx={{
              '& .MuiDrawer-paperAnchorRight': {
                background: theme.palette.primary.main,
              },
            }}
            anchor='right'
            open={isOpenRightBarDrMsg}
            onClose={toggleDrawer(false)}
          >
            <Box
              sx={{
                width: 250,
                margin: '56px 0px 0px 0px',
              }}
              role='presentation'
              onClick={toggleDrawer(false)}
              onKeyDown={toggleDrawer(false)}
            >
              <DirectMessageRightBar />
            </Box>
          </Drawer>
        </React.Fragment>
      </div>
    </div>
  );
};
