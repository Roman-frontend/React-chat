import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { useAuth } from '../../../hooks/auth.hook.js';
import { useQuery, useApolloClient } from '@apollo/client';
import { AUTH } from '../../../GraphQLApp/queryes';

const HeaderProfile = ({
  menuId,
  anchorEl,
  setAnchorEl,
  handleMobileMenuClose,
}) => {
  const { data: auth } = useQuery(AUTH);
  const { logout } = useAuth();
  const isMenuOpen = Boolean(anchorEl);
  const client = useApolloClient();

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  function handleLogout() {
    //client.resetStore()  Найпростіший спосіб переконатися, що стан інтерфейсу користувача та сховища відображає поточні дозволи користувача - це зателефонувати client.resetStore () після завершення процесу входу або виходу. Це призведе до очищення сховища та перегляду всіх активних запитів.
    client.clearStore(); //Якщо ви просто хочете, щоб магазин був очищений, і ви не хочете отримувати активні запити, використовуйте замість цього client.clearStore (). Інший варіант - перезавантажити сторінку, що матиме подібний ефект.
    logout();
  }

  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        {auth && auth.name ? auth.name : '#general'}
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      <MenuItem onClick={handleLogout}>Log out</MenuItem>
    </Menu>
  );
};

export default React.memo(HeaderProfile);
