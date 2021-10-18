import { createTheme } from '@material-ui/core/styles';
import { red, yellow, grey, green, brown } from '@material-ui/core/colors';

const theme = createTheme({
  palette: {
    background: {
      paper: '#272738', //brown[800],
    },
    type: 'dark', //'light',
    primary: {
      light: red[100],
      main: '#090912', //grey[900],
      contrastText: yellow[100],
    },
    secondary: {
      main: '#ff5e1f',
      contrastText: green[900],
    },
    error: {
      main: '#ffffff',
      contrastText: '#ffffff',
    },
    text: {
      primary: '#FFFFFF',
      disabled: grey[500],
    },
    //#37374f
    action: {
      active: '#ffffff',
      hover: '#131329',
      hoverOpacity: 0.5,
      selected: '#191924',
    },
    tonalOffset: 0.1,
  },
  shape: {
    borderRadius: 20,
  },
});

export default theme;
