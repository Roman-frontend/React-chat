import React, { useContext } from 'react';
import { useQuery, useApolloClient } from '@apollo/client';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import AssignmentIndSharpIcon from '@mui/icons-material/AssignmentIndSharp';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../../../hooks/auth.hook.js';
import { CustomThemeContext } from '../../../App';
import { AUTH } from '../../../GraphQLApp/queryes';
import imageProfile from '../../../images/Profile.jpg';

const HeaderProfile = (props) => {
  const { setTheme } = useContext(CustomThemeContext);
  const { data: auth } = useQuery(AUTH);
  const { logout } = useAuth();
  const client = useApolloClient();

  function handleLogout() {
    //client.resetStore()  Найпростіший спосіб переконатися, що стан інтерфейсу користувача та сховища відображає поточні дозволи користувача - це зателефонувати client.resetStore () після завершення процесу входу або виходу. Це призведе до очищення сховища та перегляду всіх активних запитів.
    client.clearStore(); //Якщо ви просто хочете, щоб магазин був очищений, і ви не хочете отримувати активні запити, використовуйте замість цього client.clearStore (). Інший варіант - перезавантажити сторінку, що матиме подібний ефект.
    setTheme('light');
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
