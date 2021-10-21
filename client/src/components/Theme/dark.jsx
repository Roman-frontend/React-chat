import { createTheme } from '@mui/material/styles';
import { red, yellow, grey, green, brown } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    background: {
      paper: yellow[100], //brown[800],
    },
    type: 'dark', //'light',
    primary: {
      light: '#272738',
      dark: yellow[100],
      main: '#090912', //grey[900],
      contrastText: yellow[100],
    },
    secondary: {
      light: '#090912',
      dark: '#ffffff',
      main: '#000000',
      contrastText: green[100],
    },
    error: {
      main: red[500],
      contrastText: '#ffffff',
    },
    text: {
      primary: '#ffffff',
      secondary: '#ffffff',
      disabled: grey[100],
    },
    //#37374f
    action: {
      active: yellow[100],
      hover: '#131329',
      hoverOpacity: 0.5,
      selected: yellow[100],
    },
    tonalOffset: 0.1,
  },
  shape: {
    borderRadius: 20,
  },
});

export default theme;
