import { createTheme } from '@material-ui/core/styles';
import {
  red,
  yellow,
  grey,
  green,
  brown,
  blue,
} from '@material-ui/core/colors';

const theme = createTheme({
  palette: {
    background: {
      paper: '#f5f5f5',
    },
    type: 'light',
    primary: {
      light: red[100],
      main: '#c9c9c9',
      contrastText: '#0000b5',
    },
    secondary: {
      main: '#ff0000', //lightGreen[400],
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#000000',
      contrastText: red[100],
    },
    text: {
      primary: '#262626',
      disabled: grey[500],
    },
    action: {
      active: '#0000b5',
      hover: '#ebebeb',
      hoverOpacity: 0.1,
      selected: '#ababff',
    },
    tonalOffset: 0.1,
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
  /* Зміна кольору тексту кнопки 
  overrides: {
    MuiButton: {
      label: {
        color: '#f1f1f1',
      },
    },
  }, */
});

/* const theme = createTheme({
  palette: {
    background: {
      paper: '#7affd1',
    },
    type: 'light',
    primary: {
      light: red[100],
      main: '#e05122',
      contrastText: yellow[100],
    },
    secondary: {
      main: '#fff200', //lightGreen[400],
      contrastText: green[900],
    },
    text: {
      primary: '#262626',
      disabled: grey[500],
    },
    action: {
      active: '#fc8700',
      hover: '#00ffa7',
      hoverOpacity: 0.1,
      selected: '#e05122',
    },
    tonalOffset: 0.1,
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
}); */

export default theme;
