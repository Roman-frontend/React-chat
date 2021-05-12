import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { useAuth } from '../../../hooks/auth.hook.js';
import { useQuery } from '@apollo/client';
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

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

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
      <MenuItem onClick={logout}>Log out</MenuItem>
    </Menu>
  );
};

export default React.memo(HeaderProfile);
