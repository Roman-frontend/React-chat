import React, { Suspense, lazy, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STORAGE_NAME, GET_USERS_ONLINE } from '../../redux/types';
import { wsSend, wsSingleton } from '../../WebSocket/soket';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { fetchData } from '../../hooks/suspense';
import './chat-page.sass';
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
  const dispatch = useDispatch();
  const online = useSelector((state) => state.usersOnline);
  const sessionStorageData = JSON.parse(sessionStorage.getItem(STORAGE_NAME));
  const resSuspense = useMemo(() => {
    return fetchData(sessionStorageData.token, sessionStorageData.userData);
  }, []);

  useEffect(() => {
    wsSingleton.clientPromise
      .then((wsClient) => {
        wsClient.addEventListener('message', (response) => {
          const parsedRes = JSON.parse(response.data);
          //console.log(parsedRes);
          if (parsedRes.message === 'online') {
            if (JSON.stringify(online) !== JSON.stringify(parsedRes.members)) {
              dispatch({ type: GET_USERS_ONLINE, payload: parsedRes.members });
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
      const sStorage = JSON.parse(sessionStorage.getItem(STORAGE_NAME));
      if (sStorage && sStorage.userData) {
        const userData = sStorage.userData;
        const allUserChats = userData.channels.concat(userData.directMessages);
        wsSend({ userRooms: allUserChats, meta: 'join', userId: userData._id });
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
        <SetsUser resSuspense={resSuspense} />
        <Conversation resSuspense={resSuspense} />
      </Suspense>
    </div>
  );
};
