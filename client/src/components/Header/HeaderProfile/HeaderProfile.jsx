import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import Avatar from '@material-ui/core/Avatar';
import MailIcon from '@material-ui/icons/Mail';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import AssignmentIndSharpIcon from '@material-ui/icons/AssignmentIndSharp';
import PersonIcon from '@material-ui/icons/Person';
import { useAuth } from '../../../hooks/auth.hook.js';
import { useQuery, useApolloClient } from '@apollo/client';
import { AUTH } from '../../../GraphQLApp/queryes';
import imageProfile from '../../../images/Profile.jpg';

const HeaderProfile = (props) => {
  const { data: auth } = useQuery(AUTH);
  const { logout } = useAuth();
  const client = useApolloClient();

  function handleLogout() {
    //client.resetStore()  Найпростіший спосіб переконатися, що стан інтерфейсу користувача та сховища відображає поточні дозволи користувача - це зателефонувати client.resetStore () після завершення процесу входу або виходу. Це призведе до очищення сховища та перегляду всіх активних запитів.
    client.clearStore(); //Якщо ви просто хочете, щоб магазин був очищений, і ви не хочете отримувати активні запити, використовуйте замість цього client.clearStore (). Інший варіант - перезавантажити сторінку, що матиме подібний ефект.
    logout();
  }

  return (
    <List>
      <ListItem button>
        <ListItemIcon>
          <Avatar alt='Remy Sharp' src={imageProfile} style={{ size: '5px' }} />
        </ListItemIcon>
        <ListItemText primary={auth && auth.name ? auth.name : '#general'} />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <PersonIcon />
        </ListItemIcon>
        <ListItemText primary='Profile' />
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <AssignmentIndSharpIcon />
        </ListItemIcon>
        <ListItemText primary='My Acount' />
      </ListItem>
      <ListItem button onClick={handleLogout}>
        <ListItemIcon>
          <MeetingRoomIcon />
        </ListItemIcon>
        <ListItemText primary='Logout' />
      </ListItem>
    </List>
  );
};

export default React.memo(HeaderProfile);
