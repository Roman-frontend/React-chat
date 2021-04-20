import React, { Suspense, lazy, useMemo, useEffect } from 'react';
import { STORAGE_NAME } from '../../redux/types';
import { wsSend, wsSingleton } from '../../WebSocket/soket';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { reactiveOnlineMembers } from '../../components/GraphQL/reactiveVariables';
import './chat-page.sass';
import { useQuery } from '@apollo/client';
import { APP } from '../../components/GraphQL/queryes';
const Header = lazy(() => import('../../components/Header/Header.jsx'));
const Conversation = lazy(() =>
  import('../../components/Conversation/Conversation.jsx')
);
const SetsUser = lazy(() => import('../../components/SetsUser/SetsUser.jsx'));

const useStyles = makeStyles((theme) => ({
  root: { position: 'fixed', left: '50%', top: '50%' },
}));

export const Chat = () => {
  const classes = useStyles();
  const { data: app } = useQuery(APP);

  useEffect(() => {
    wsSingleton.clientPromise
      .then((wsClient) => {
        wsClient.addEventListener('message', (response) => {
          const parsedRes = JSON.parse(response.data);
          //console.log(parsedRes);
          if (parsedRes.message === 'online') {
            if (
              app &&
              app.usersOnline &&
              JSON.stringify(app.usersOnline) !==
                JSON.stringify(parsedRes.members)
            ) {
              reactiveOnlineMembers(parsedRes.members);
            }
          }
        });
      })
      .catch((error) => console.log(error));
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
      const storage = JSON.parse(sessionStorage.getItem(STORAGE_NAME));
      if (storage && storage.channels && storage.directMessages) {
        const allUserChats = storage.channels.concat(storage.directMessages);
        wsSend({ userRooms: allUserChats, meta: 'join', userId: storage.id });
      }
      //console.info('This page is reloaded');
    } else {
      //console.info('This page is not reloaded');
    }
  }, []);

  return (
    <div className='chat-page'>
      <Suspense
        fallback={
          <div className={classes.root}>
            <CircularProgress color='secondary' />
          </div>
        }
      >
        <Header />
        <SetsUser />
        <Conversation />
      </Suspense>
    </div>
  );
};
