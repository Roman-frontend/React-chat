import React, { Suspense, lazy } from 'react';
import { STORAGE_NAME } from '../../redux/types';
import { wsSend } from '../../WebSocket/soket';
import { ChatContext } from '../../Context/ChatContext.js';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import './chat-page.sass';
const Header = lazy(() => import('../../components/Header/Header.jsx'));
const Conversation = lazy(() =>
  import('../../components/Conversation/Conversation.jsx')
);
const SetsUser = lazy(() => import('../../components/SetsUser/SetsUser.jsx'));

const useStyles = makeStyles((theme) => ({
  root: { position: 'fixed', left: '50%', top: '50%' },
}));

//check for Navigation Timing API support
if (window.performance) {
  console.info('window.performance works fine on this browser');
}
//console.info(performance.navigation.type);
if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
  const storageData = JSON.parse(sessionStorage.getItem(STORAGE_NAME));
  if (storageData && storageData.userData && storageData.userData.channels[0]) {
    const allUserChats = storageData.userData.channels.concat(
      storageData.userData.directMessages
    );
    wsSend({
      userRooms: allUserChats,
      userId: storageData.userData._id,
      meta: 'leave',
      path: 'Chat',
    });
  }
  console.info('This page is reloaded');
} else {
  console.info('This page is not reloaded');
}

export const Chat = () => {
  const classes = useStyles();

  return (
    <div className='chat-page'>
      <ChatContext>
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
      </ChatContext>
    </div>
  );
};
