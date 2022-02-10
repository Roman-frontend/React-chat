import React, { useState, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import 'tippy.js/dist/tippy.css';
import { useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import { Grid } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import HeaderProfile from './HeaderProfile/HeaderProfile.jsx';
import { MaterialUISwitch } from './HeaderStyles';
import AppBar from '@mui/material/AppBar';
import { CustomThemeContext } from '../../App';
import imageProfile from '../../images/User-Icon.png';

interface IProps {
  isOpenLeftBar: boolean;
  setIsOpenLeftBar: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header(props: IProps) {
  const theme = useTheme();
  const { isOpenLeftBar, setIsOpenLeftBar } = props;
  const { currentTheme, setTheme } = useContext(CustomThemeContext);
  const menuId = 'primary-search-account-menu';
  const { t, i18n } = useTranslation();
  const [isOpenRightBarUser, setIsOpenRightBarUser] = useState(false);
  const tooltipEn = useMemo(() => {
    return i18n.language === 'en'
      ? t('description.infoLanguage')
      : t('description.changeEnLanguage');
  }, [i18n.language]);
  const tooltipRu = useMemo(() => {
    return i18n.language === 'ru'
      ? t('description.infoLanguage')
      : t('description.changeRuLanguage');
  }, [i18n.language]);

  const isDark = Boolean(currentTheme === 'dark');

  const changeLanguage = (language: string): void => {
    i18n.changeLanguage(language);
  };

  const handleChangeSwitch = (event: { target: { checked: boolean } }) => {
    console.log(event);

    const { checked } = event.target;
    if (
      !checked &&
      setTheme &&
      {}.toString.call(setTheme) === '[object Function]'
    ) {
      setTheme('dark');
    } else if (setTheme && {}.toString.call(setTheme) === '[object Function]') {
      setTheme('light');
    }
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
      >
        <Toolbar>
          <IconButton
            onClick={() => setIsOpenLeftBar(!isOpenLeftBar)}
            edge='start'
          >
            <MenuIcon />
          </IconButton>
          <Grid item xs={9}>
            <Typography variant='h6' noWrap component='div'>
              {t('description.header')}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <MaterialUISwitch
              sx={{ m: 1 }}
              checked={!isDark}
              onChange={handleChangeSwitch}
            />
          </Grid>
          <Grid item xs={1}>
            <Tooltip
              title={tooltipEn}
              TransitionComponent={Zoom}
              placement='bottom'
            >
              <Button
                style={{
                  background:
                    i18n.language === 'en'
                      ? theme.palette.primary.main
                      : 'none',
                  border: i18n.language === 'en' ? 'solid 2px' : 'none',
                  padding: 0,
                }}
                color='inherit'
                onClick={() => changeLanguage('en')}
              >
                EN
              </Button>
            </Tooltip>
          </Grid>
          <Grid item xs={1}>
            <Tooltip
              title={tooltipRu}
              TransitionComponent={Zoom}
              placement='bottom'
            >
              <Button
                style={{
                  background:
                    i18n.language === 'ru'
                      ? theme.palette.primary.main
                      : 'none',
                  border: i18n.language === 'ru' ? 'solid 2px' : 'none',
                  padding: 0,
                }}
                color='inherit'
                onClick={() => changeLanguage('ru')}
              >
                RU
              </Button>
            </Tooltip>
          </Grid>
          <Grid item xs={1}>
            <IconButton
              size='large'
              edge='end'
              aria-label='account of current user'
              aria-controls={menuId}
              aria-haspopup='true'
              onClick={() => setIsOpenRightBarUser(true)}
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
                onClose={() => setIsOpenRightBarUser(false)}
              >
                <Box
                  sx={{ width: 250, margin: '56px 0px 0px 0px' }}
                  role='presentation'
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
