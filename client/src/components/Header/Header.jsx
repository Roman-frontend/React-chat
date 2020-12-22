import React, { useState } from 'react';
import Tippy from '@tippy.js/react';
import 'tippy.js/dist/tippy.css';
import useStyles from './HeaderStyles.jsx';
import HeaderProfile from './HeaderProfile/HeaderProfile';
import HeaderNotifications from './HeaderNotifications';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Avatar from '@material-ui/core/Avatar';
import MoreIcon from '@material-ui/icons/MoreVert';
import { Trans, useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import useChatContext from '../../Context/ChatContext';
import imageProfile from '../../images/Profile.jpg';

export default function Header() {
  const classes = useStyles();
  const { changeLanguage } = useChatContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const menuId = 'primary-search-account-menu';
  const mobileMenuId = 'primary-search-account-menu-mobile';
  const { t } = useTranslation();

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  return (
    <div className={classes.rootHeader}>
      <AppBar position='static' style={{ height: '9vh' }}>
        <Toolbar>
          <IconButton
            edge='start'
            className={classes.menuButton}
            color='inherit'
            aria-label='open drawer'
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant='h6' noWrap>
            {t('description.part3')}
          </Typography>
          <div className={classes.search} style={{ marginRight: '12vw' }}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder={t('description.search')}
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputprops={{ 'aria-label': 'search' }}
            />
          </div>

          <Tippy content={t('description.part2')}>
            <Button onClick={() => changeLanguage('en')}>EN</Button>
          </Tippy>
          <Tippy content={t('description.part2')}>
            <Button onClick={() => changeLanguage('ru')}>RU</Button>
          </Tippy>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton aria-label='show 4 new mails' color='inherit'>
              <Badge badgeContent={4} color='secondary'>
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton aria-label='show 17 new notifications' color='inherit'>
              <Badge badgeContent={17} color='secondary'>
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              edge='end'
              aria-label='account of current user'
              aria-controls={menuId}
              aria-haspopup='true'
              onClick={handleProfileMenuOpen}
              color='inherit'
            >
              <Avatar alt='Remy Sharp' src={imageProfile} />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label='show more'
              aria-controls={mobileMenuId}
              aria-haspopup='true'
              onClick={handleMobileMenuOpen}
              color='inherit'
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>

      <HeaderNotifications
        mobileMenuId={mobileMenuId}
        mobileMoreAnchorEl={mobileMoreAnchorEl}
        handleMobileMenuClose={handleMobileMenuClose}
        handleProfileMenuOpen={handleProfileMenuOpen}
      />
      <HeaderProfile
        menuId={menuId}
        anchorEl={anchorEl}
        handleMobileMenuClose={handleMobileMenuClose}
        setAnchorEl={setAnchorEl}
      />
    </div>
  );
}
