import React, { useCallback, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
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
import { activeChatId } from '../../GraphQLApp/reactiveVars';

export const Chat = (props) => {
  const usersOnline = useReactiveVar(reactiveOnlineMembers);
  const activeChat = useReactiveVar(activeChatId);
  const activeChannelId = useReactiveVar(activeChatId).activeChannelId;
  const activeDirectMessageId =
    useReactiveVar(activeChatId).activeDirectMessageId;
  const { loading: lUsers } = useQuery(GET_USERS);
  const { loading: lChannels, data: dChannels } = useQuery(CHANNELS);
  const { loading: lDirectMessages, data: dDm } = useQuery(GET_DIRECT_MESSAGES);
  const [isErrorInPopap, setIsErrorInPopap] = useState(false);
  const [isOpenLeftBar, setIsOpenLeftBar] = useState(true);
  const [modalAddPeopleIsOpen, setModalAddPeopleIsOpen] = useState(false);
  const [show, setShow] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    showConversation();
  }, [activeChat, modalAddPeopleIsOpen]);

  useEffect(() => {
    if (
      (dChannels &&
        dChannels.userChannels &&
        dChannels.userChannels.length > 0) ||
      (dDm &&
        dDm.directMessages &&
        dDm.directMessages.length > 0 &&
        (activeChannelId || activeDirectMessageId))
    ) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [activeChannelId, activeDirectMessageId, lChannels, lDirectMessages]);

  useEffect(() => {
    if (
      dChannels &&
      dChannels.userChannels &&
      dChannels.userChannels.length === 0 &&
      dDm &&
      dDm.directMessages &&
      dDm.directMessages.length === 0
    ) {
      setShow(false);
    }
  }, [dChannels, dDm]);

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

  const showConversation = () => {
    if (show) {
      return (
        <Conversation
          modalAddPeopleIsOpen={modalAddPeopleIsOpen}
          setModalAddPeopleIsOpen={setModalAddPeopleIsOpen}
          isErrorInPopap={isErrorInPopap}
          setIsErrorInPopap={setIsErrorInPopap}
        />
      );
    }
  };

  if (lUsers && lChannels && lDirectMessages) {
    return <Loader />;
  }

  console.log(show);

  return (
    <Box style={{ display: 'flex', flexFlow: 'column', height: '100%' }}>
      <Grid container spacing={2}>
        <CssBaseline />
        <Grid item xs={12}>
          <Header
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
        <Box component='main' sx={{ flexGrow: 1, p: '20px 0px 0px 0px' }}>
          <main>{showConversation()}</main>
        </Box>
      </Grid>
    </Box>
  );
};
