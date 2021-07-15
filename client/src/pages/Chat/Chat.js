import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
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
import { useStyles } from './ChatStyles.jsx';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import HeaderProfile from '../../components/Header/HeaderProfile/HeaderProfile';
import DirectMessageRightBar from '../../components/SetsUser/DirectMessages/DirectMessageRightBar';
import ChannelsRightBar from '../../components/SetsUser/Channels/ChannelsRightBar';

const drawerWidth = 240;

const useSecondStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  },
  title: {
    flexGrow: 1,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  },
}));

export const Chat = () => {
  const classes = useStyles();
  const secondClasses = useSecondStyles();
  const usersOnline = useReactiveVar(reactiveOnlineMembers);
  const { loading: lUsers } = useQuery(GET_USERS);
  const { loading: lChannels } = useQuery(CHANNELS);
  const { loading: lDirectMessages } = useQuery(GET_DIRECT_MESSAGES);
  const [alertData, setAlertData] = useState({});
  const [isOpenLeftBar, setIsOpenLeftBar] = useState(true);
  const [isOpenRightBarUser, setIsOpenRightBarUser] = useState(false);
  const [isOpenRightBarDrMsg, setIsOpenRightBarDrMsg] = useState(false);
  const [isOpenRightBarChannels, setIsOpenRightBarChannels] = useState(false);

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
      <div className={classes.root}>
        <Header
          leftBarClasses={classes}
          isOpenLeftBar={isOpenLeftBar}
          setIsOpenLeftBar={setIsOpenLeftBar}
          isOpenRightBarUser={isOpenRightBarUser}
          setIsOpenRightBarUser={setIsOpenRightBarUser}
          setIsOpenRightBarDrMsg={setIsOpenRightBarDrMsg}
          setIsOpenRightBarChannels={setIsOpenRightBarChannels}
        />
        <Drawer
          variant='permanent'
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: isOpenLeftBar,
            [classes.drawerClose]: !isOpenLeftBar,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: isOpenLeftBar,
              [classes.drawerClose]: !isOpenLeftBar,
            }),
          }}
        >
          <Divider />
          <SetsUser
            alertData={alertData}
            setAlertData={setAlertData}
            isOpenLeftBar={isOpenLeftBar}
            setIsOpenLeftBar={setIsOpenLeftBar}
          />
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Conversation
            isOpenRightBarDrMsg={isOpenRightBarDrMsg}
            setIsOpenRightBarDrMsg={setIsOpenRightBarDrMsg}
            setIsOpenRightBarUser={setIsOpenRightBarUser}
            isOpenRightBarChannels={isOpenRightBarChannels}
            setIsOpenRightBarChannels={setIsOpenRightBarChannels}
          />
        </main>
        <Drawer
          className={secondClasses.drawer}
          variant='persistent'
          anchor='right'
          open={isOpenRightBarUser}
          classes={{
            paper: secondClasses.drawerPaper,
          }}
        >
          <div className={secondClasses.drawerHeader}>
            <IconButton />
          </div>
          <Divider />
          <HeaderProfile />
        </Drawer>
        <Drawer
          className={secondClasses.drawer}
          variant='persistent'
          anchor='right'
          open={isOpenRightBarDrMsg}
          classes={{
            paper: secondClasses.drawerPaper,
          }}
        >
          <div className={secondClasses.drawerHeader}>
            <IconButton />
          </div>
          <Divider />
          <DirectMessageRightBar
            setAlertData={setAlertData}
            setIsOpenRightBarDrMsg={setIsOpenRightBarDrMsg}
          />
        </Drawer>
        <Drawer
          className={secondClasses.drawer}
          variant='persistent'
          anchor='right'
          open={isOpenRightBarChannels}
          classes={{
            paper: secondClasses.drawerPaper,
          }}
        >
          <div className={secondClasses.drawerHeader}>
            <IconButton />
          </div>
          <Divider />
          <ChannelsRightBar
            setAlertData={setAlertData}
            setIsOpenRightBarChannels={setIsOpenRightBarChannels}
          />
        </Drawer>
      </div>
    </React.StrictMode>
  );
};
