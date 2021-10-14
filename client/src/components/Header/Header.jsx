import React, { useState, useContext } from 'react';
import clsx from 'clsx';
import Tippy from '@tippy.js/react';
import 'tippy.js/dist/tippy.css';
import useStyles from './HeaderStyles.jsx';
import AppBar from '@material-ui/core/AppBar';
import { Grid } from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import MenuIcon from '@material-ui/icons/Menu';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Avatar from '@material-ui/core/Avatar';
import MoreIcon from '@material-ui/icons/MoreVert';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import imageProfile from '../../images/Profile.jpg';
import { Switch } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import HeaderNotifications from './HeaderNotifications';
import { CustomThemeContext } from '../Theme/CustomeThemeProvider';

const IOSSwitch = withStyles((theme) => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(16px)',
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: '#f5f5f5',
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: '#FFFFFF',
      border: '6px solid #fff',
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.grey[900],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

export default function Header(props) {
  const {
    leftBarClasses,
    isOpenLeftBar,
    setIsOpenLeftBar,
    isOpenRightBarUser,
    setIsOpenRightBarUser,
    setIsOpenRightBarDrMsg,
    setIsOpenRightBarChannels,
  } = props;
  const classes = useStyles();
  const { currentTheme, setTheme } = useContext(CustomThemeContext);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const menuId = 'primary-search-account-menu';
  const mobileMenuId = 'primary-search-account-menu-mobile';
  const { t, i18n } = useTranslation();

  const isDark = Boolean(currentTheme === 'dark');

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  const handleProfileMenuOpen = (event) => {
    setIsOpenRightBarDrMsg(false);
    setIsOpenRightBarChannels(false);
    setIsOpenRightBarUser(!isOpenRightBarUser);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleChangeSwitch = (event) => {
    const { checked } = event.target;
    if (checked) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  return (
    <div className={classes.rootHeader}>
      <Grid container spacing={1} style={{ justifyContent: 'space-between' }}>
        <AppBar
          position='fixed'
          style={{ height: '9vh' }}
          className={clsx(leftBarClasses.appBar, {
            [leftBarClasses.appBarShift]: isOpenLeftBar,
          })}
        >
          <Toolbar variant='dense'>
            <IconButton
              edge='start'
              className={classes.menuButton}
              onClick={() => setIsOpenLeftBar(!isOpenLeftBar)}
              color='inherit'
              aria-label='open drawer'
            >
              <MenuIcon />
            </IconButton>
            <Grid item xs={12}>
              <Typography className={classes.title} variant='h6' noWrap>
                {t('description.part3')}
              </Typography>
            </Grid>

            <Grid items xs={1}>
              <FormControlLabel
                control={
                  <IOSSwitch
                    checked={isDark}
                    onChange={handleChangeSwitch}
                    name='checkedA'
                  />
                }
              />
            </Grid>
            <Grid items xs={2}>
              <Tippy content={t('description.part2')}>
                <Button onClick={() => changeLanguage('en')}>EN</Button>
              </Tippy>
              <Tippy content={t('description.part2')}>
                <Button onClick={() => changeLanguage('ru')}>RU</Button>
              </Tippy>
            </Grid>
            <Grid items xs={1}>
              <div className={classes.grow} />
              <div className={classes.sectionDesktop}>
                <IconButton aria-label='show 4 new mails' color='inherit'>
                  <Badge badgeContent={4} color='secondary'>
                    <MailIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  aria-label='show 17 new notifications'
                  color='inherit'
                >
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
            </Grid>
            <Grid items xs={1}>
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
            </Grid>
          </Toolbar>
        </AppBar>

        <HeaderNotifications
          mobileMenuId={mobileMenuId}
          mobileMoreAnchorEl={mobileMoreAnchorEl}
          handleMobileMenuClose={handleMobileMenuClose}
          handleProfileMenuOpen={handleProfileMenuOpen}
        />
      </Grid>
    </div>
  );
}
