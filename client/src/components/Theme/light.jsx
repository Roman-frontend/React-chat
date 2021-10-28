import { createTheme } from '@mui/material/styles';
import { red, yellow, grey, green, brown, blue } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    background: {
      paper: '#f5f5f5',
      default: '#ffffff',
    },
    mode: 'light',
    primary: {
      light: '#ffffff',
      main: '#f5f5f5',
      dark: '#c9c9c9', //#636363
      contrastText: '#0000b5',
    },
    secondary: {
      main: '#000000', //lightGreen[400],
      contrastText: '#FFFFFF',
    },
    input: {
      main: '#000000', //lightGreen[400],
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#ff0000',
      contrastText: red[100],
    },
    text: {
      primary: '#262626',
      secondary: '#0000b5',
      select: '#0000b5',
      disabled: grey[500],
    },
    action: {
      active: '#0000b5',
      hover: '#c9c9c9',
      hoverOpacity: 0.5,
      selected: '#0000b5',
      focus: red[400],
      focusOpacity: grey[900],
      activatedOpacity: 0.3,
    },
    tonalOffset: 0.1,
    contrastThreshold: 8,
  },
  shape: {
    borderRadius: 7,
  },
  shadows: [
    '0px 1px 3px 0px rgba(0, 0, 0, 0.2),0px 1px 1px 0px rgba(0, 0, 0, 0.14),0px 2px 1px -1px rgba(0, 0, 0, 0.12)',
    '0px 1px 5px 0px rgba(0, 0, 0, 0.2),0px 2px 2px 0px rgba(0, 0, 0, 0.14),0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
  ],
  typography: {
    caption: {
      fontWeight: 600,
    },
  },
  //Зміна кольору тексту кнопки
  /* overrides: {
    MuiButton: {
      label: {
        color: '#f1f1f1',
      },
    },
  }, */
});

export default theme;
