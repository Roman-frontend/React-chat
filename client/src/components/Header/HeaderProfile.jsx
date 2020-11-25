import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../hooks/auth.hook.js";

export default function HeaderProfile(props) {
  const { menuId, anchorEl, setAnchorEl, handleMobileMenuClose } = props;
  const history = useHistory();
  const { logout } = useAuth();
  const userData = useSelector((state) => state.userData);
  const isMenuOpen = Boolean(anchorEl);

  const logoutHandler = (event) => {
    event.preventDefault();
    logout();
    history.push("/");
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>{userData.name}</MenuItem>
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      <MenuItem onClick={logoutHandler}>Log out</MenuItem>
    </Menu>
  );
}
