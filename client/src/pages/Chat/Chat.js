import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import { styled, useTheme, alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import { wsSend, wsSingleton } from '../../WebSocket/soket';
import {
  reactiveOnlineMembers,
  reactiveVarPrevAuth,
} from '../../GraphQLApp/reactiveVars';
import { GET_USERS } from '../../GraphQLApp/queryes';
import { useQuery, useReactiveVar } from '@apollo/client';
import Header from '../../components/Header/Header.jsx';
import Conversation from '../../components/Conversation/Conversation.jsx';
import SetsUser from '../../components/SetsUser/SetsUser.jsx';
import {
  CHANNELS,
  GET_DIRECT_MESSAGES,
} from '../../components/SetsUser/SetsUserGraphQL/queryes';
import { Loader } from '../../components/Helpers/Loader';
const drawerWidth = 240;

export const Chat = (props) => {
  const usersOnline = useReactiveVar(reactiveOnlineMembers);
  const { loading: lUsers } = useQuery(GET_USERS);
  const { loading: lChannels, data: dChannels } = useQuery(CHANNELS);
  const { loading: lDirectMessages, data: dDm } = useQuery(GET_DIRECT_MESSAGES);
  const [isErrorInPopap, setIsErrorInPopap] = useState(false);
  const [isOpenLeftBar, setIsOpenLeftBar] = useState(true);
  const [modalAddPeopleIsOpen, setModalAddPeopleIsOpen] = useState(false);
  const theme = useTheme();

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'isOpenLeftBar',
  })(({ theme, isOpenLeftBar }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(isOpenLeftBar && {
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));

  const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    overflowY: 'scroll',
  });

  const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    overflowY: 'scroll',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
      width: `calc(${theme.spacing(30)} + 1px)`,
    },
  });

  const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== 'isOpenLeftBar',
  })(({ theme, isOpenLeftBar }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(isOpenLeftBar && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!isOpenLeftBar && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }));

  useEffect(() => {
    wsSingleton.clientPromise
      .then((wsClient) => {
        wsClient.addEventListener('message', (response) => {
          const parsedRes = JSON.parse(response.data);
          if (
            parsedRes.message === 'online' &&
            JSON.stringify(usersOnline) !== JSON.stringify(parsedRes.members)
          ) {
            reactiveOnlineMembers(parsedRes.members);
          }
        });
      })
      .catch((error) => console.log(error));

    const storage = JSON.parse(sessionStorage.getItem('storageData'));
    if (storage) reactiveVarPrevAuth(storage);
  }, []);

  useEffect(() => {
    //check for Navigation Timing API support
    if (window.performance) {
      //console.info('window.performance works fine on this browser');
    }
    //console.info(performance.navigation.type);
    if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
      wsSingleton.clientPromise
        .then((wsClient) => console.log('ONLINE'))
        .catch((error) => console.log(error));
      const storage = JSON.parse(sessionStorage.getItem('storageData'));
      if (storage && storage.channels && storage.directMessages) {
        const allUserChats = storage.channels.concat(storage.directMessages);
        wsSend({ userRooms: allUserChats, meta: 'join', userId: storage.id });
      }
      //console.info('This page is reloaded');
    } else {
      //console.info('This page is not reloaded');
    }
  }, []);

  if (lUsers || lChannels || lDirectMessages) {
    return <Loader />;
  }

  return (
    <Box style={{ display: 'flex', flexFlow: 'column', height: '100%' }}>
      <Grid container spacing={2}>
        <CssBaseline />
        <Grid item xs={12}>
          <Header
            AppBar={AppBar}
            isOpenLeftBar={isOpenLeftBar}
            setIsOpenLeftBar={setIsOpenLeftBar}
          />
        </Grid>
        <SetsUser
          isErrorInPopap={isErrorInPopap}
          setIsErrorInPopap={setIsErrorInPopap}
          isOpenLeftBar={isOpenLeftBar}
          setIsOpenLeftBar={setIsOpenLeftBar}
          modalAddPeopleIsOpen={modalAddPeopleIsOpen}
        />
        <Box
          component='main'
          sx={{ flexGrow: 1, p: 3 }}
          style={{
            padding: '20px 0px 0px 0px',
          }}
        >
          <main>
            {((dChannels &&
              dChannels.userChannels &&
              dChannels.userChannels.length > 0) ||
              (dDm &&
                dDm.directMessagesId &&
                dDm.directMessagesId.length > 0)) && (
              <Conversation
                modalAddPeopleIsOpen={modalAddPeopleIsOpen}
                setModalAddPeopleIsOpen={setModalAddPeopleIsOpen}
                isErrorInPopap={isErrorInPopap}
                setIsErrorInPopap={setIsErrorInPopap}
              />
            )}
          </main>
        </Box>
      </Grid>
    </Box>
  );
};
