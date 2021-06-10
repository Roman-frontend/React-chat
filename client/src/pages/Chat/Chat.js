import React, { useEffect } from 'react';
import { wsSend, wsSingleton } from '../../WebSocket/soket';
import {
  reactiveOnlineMembers,
  reactiveVarPrevAuth,
} from '../../GraphQLApp/reactiveVars';
import { GET_USERS } from '../../GraphQLApp/queryes';
import './chat-page.sass';
import { useQuery, useReactiveVar } from '@apollo/client';
import Header from '../../components/Header/Header.jsx';
import Conversation from '../../components/Conversation/Conversation.jsx';
import SetsUser from '../../components/SetsUser/SetsUser.jsx';
import {
  CHANNELS,
  GET_DIRECT_MESSAGES,
} from '../../components/SetsUser/SetsUserGraphQL/queryes';
import { Loader } from '../../components/Helpers/Loader';

export const Chat = () => {
  const usersOnline = useReactiveVar(reactiveOnlineMembers);
  const { loading: lUsers } = useQuery(GET_USERS);
  const { loading: lChannels } = useQuery(CHANNELS);
  const { loading: lDirectMessages } = useQuery(GET_DIRECT_MESSAGES);

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
    <React.StrictMode>
      <div className='chat-page'>
        <Header />
        <SetsUser />
        <Conversation />
      </div>
    </React.StrictMode>
  );
};
