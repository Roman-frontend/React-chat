import React, { useState, useContext } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Grid } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Switch from '@mui/material/Switch';
import Drawer from '@mui/material/Drawer';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import imageProfile from '../../images/Profile.jpg';
import HeaderProfile from './HeaderProfile/HeaderProfile.jsx';
import { CustomThemeContext } from '../../App';

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'isOpenLeftBar',
})(({ theme, isOpenLeftBar }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(isOpenLeftBar && {
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff'
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
    width: 32,
    height: 32,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff'
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}));

export default function Header(props) {
  const theme = useTheme();
  const { isOpenLeftBar, setIsOpenLeftBar } = props;
  const { currentTheme, setTheme } = useContext(CustomThemeContext);
  const menuId = 'primary-search-account-menu';
  const { t, i18n } = useTranslation();
  const [isOpenRightBarUser, setIsOpenRightBarUser] = useState(false);

  const isDark = Boolean(currentTheme === 'dark');

  console.log(currentTheme, setTheme);

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  const handleChangeSwitch = (event) => {
    const { checked } = event.target;
    if (!checked) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setIsOpenRightBarUser(open);
  };

  return (
    <Grid container spacing={1} style={{ justifyContent: 'space-between' }}>
      <AppBar
        color='primary'
        sx={{
          '& .MuiAppBar-colorPrimary': {
            color: theme.palette.primary.dark,
          },
          background: theme.palette.primary.dark,
        }}
        position='relative'
        open={isOpenLeftBar}
      >
        <Toolbar>
          <IconButton
            onClick={() => setIsOpenLeftBar(!isOpenLeftBar)}
            edge='start'
          >
            <MenuIcon />
          </IconButton>
          <Grid item xs={10}>
            <Typography variant='h6' noWrap component='div'>
              {t('description.part3')}
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <MaterialUISwitch
              sx={{ m: 1 }}
              checked={!isDark}
              onChange={handleChangeSwitch}
            />
          </Grid>
          <Grid item xs={1}>
            <Tippy content={t('description.part2')}>
              <Button color='inherit' onClick={() => changeLanguage('en')}>
                EN
              </Button>
            </Tippy>
          </Grid>
          <Grid item xs={1}>
            <Tippy content={t('description.part2')}>
              <Button color='inherit' onClick={() => changeLanguage('ru')}>
                RU
              </Button>
            </Tippy>
          </Grid>
          <Grid item xs={1}>
            <IconButton
              size='large'
              aria-label='show 4 new mails'
              color='inherit'
            >
              <Badge badgeContent={4} color='error'>
                <MailIcon />
              </Badge>
            </IconButton>
          </Grid>
          <Grid item xs={1}>
            <IconButton
              size='large'
              aria-label='show 17 new notifications'
              color='inherit'
            >
              <Badge badgeContent={17} color='error'>
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Grid>
          <Grid item xs={1}>
            <IconButton
              size='large'
              edge='end'
              aria-label='account of current user'
              aria-controls={menuId}
              aria-haspopup='true'
              onClick={toggleDrawer(true)}
            >
              <Avatar alt='Remy Sharp' src={imageProfile} />
            </IconButton>
          </Grid>
          <div>
            <React.Fragment>
              <Drawer
                anchor='right'
                sx={{
                  '& .MuiDrawer-paperAnchorRight': {
                    background: theme.palette.primary.main,
                  },
                }}
                open={isOpenRightBarUser}
                onClose={toggleDrawer(false)}
              >
                <Box
                  sx={{ width: 250, margin: '56px 0px 0px 0px' }}
                  role='presentation'
                  onClick={toggleDrawer(false)}
                  onKeyDown={toggleDrawer(false)}
                >
                  <HeaderProfile setTheme={setTheme} />
                </Box>
              </Drawer>
            </React.Fragment>
          </div>
        </Toolbar>
      </AppBar>
    </Grid>
  );
}
