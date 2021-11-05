import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Grid } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import HeaderProfile from './HeaderProfile/HeaderProfile.jsx';
import { AppBar, MaterialUISwitch } from './HeaderStyles.jsx';
import { CustomThemeContext } from '../../App';
import imageProfile from '../../images/Profile.jpg';

export default function Header(props) {
  const theme = useTheme();
  const { isOpenLeftBar, setIsOpenLeftBar } = props;
  const { currentTheme, setTheme } = useContext(CustomThemeContext);
  const menuId = 'primary-search-account-menu';
  const { t, i18n } = useTranslation();
  const [isOpenRightBarUser, setIsOpenRightBarUser] = useState(false);

  const isDark = Boolean(currentTheme === 'dark');

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
      return null;
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
                  <HeaderProfile />
                </Box>
              </Drawer>
            </React.Fragment>
          </div>
        </Toolbar>
      </AppBar>
    </Grid>
  );
}
