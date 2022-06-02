import React, { useContext } from "react";
import { useQuery, useApolloClient } from "@apollo/client";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
} from "@mui/material";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import { useAuth } from "../../../hooks/auth.hook.js";
import { CustomThemeContext } from "../../../Context/AppContext";
import { AUTH } from "../../../GraphQLApp/queryes";
import imageProfile from "../../../images/User-Icon.png";
import { useNavigate } from "react-router-dom";

const HeaderProfile = () => {
  const { setTheme } = useContext(CustomThemeContext);
  const { data: auth } = useQuery(AUTH);
  const { logout } = useAuth();
  const client = useApolloClient();
  const navigate = useNavigate();

  function handleLogout() {
    //client.resetStore()  Найпростіший спосіб переконатися, що стан інтерфейсу користувача та сховища відображає поточні дозволи користувача - це зателефонувати client.resetStore () після завершення процесу входу або виходу. Це призведе до очищення сховища та перегляду всіх активних запитів.
    client.clearStore(); //Якщо ви просто хочете, щоб магазин був очищений, і ви не хочете отримувати активні запити, використовуйте замість цього client.clearStore (). Інший варіант - перезавантажити сторінку, що матиме подібний ефект.
    setTheme("light");
    logout();
    navigate("/signIn");
  }

  return (
    <List>
      <ListItem button>
        <ListItemIcon>
          <Avatar alt="Remy Sharp" src={imageProfile} style={{ size: "5px" }} />
        </ListItemIcon>
        <ListItemText primary={auth && auth.name ? auth.name : "#general"} />
      </ListItem>
      <ListItem button onClick={() => navigate(`/video`)}>
        <ListItemIcon>
          <MeetingRoomIcon />
        </ListItemIcon>
        <ListItemText primary="Enter to call-rooms" />
      </ListItem>
      <ListItem data-testid="logout-button" button onClick={handleLogout}>
        <ListItemIcon>
          <MeetingRoomIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItem>
    </List>
  );
};

export default React.memo(HeaderProfile);
