import { fade, makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  rootHeader: {
    minHeight: '0px',
    gridArea: 'header',
    background: '#3F0E40',
    color: '#ffffff',
    display: 'flex',
    cursor: 'pointer',
    alignItems: 'center',
  },
  menuButton: {
    //marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    /* [theme.breakpoints.up('sm')]: {
      display: 'block',
    }, */
  },
  inputRoot: {
    color: 'inherit',
    width: '41vw',
  },
  inputInput: {
    //padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    //paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    //transition: theme.transitions.create('width'),
    //width: '100%',
    /* [theme.breakpoints.up('md')]: {
      //width field search-input
      width: '50ch',
    }, */
  },
  sectionDesktop: {
    display: 'none',
    //відступ вправо правих іконок від поля пошуку
    /* [theme.breakpoints.up('md')]: {
      display: 'flex',
    }, */
  },
  sectionMobile: {
    display: 'flex',
    /* [theme.breakpoints.up('md')]: {
      display: 'none',
    }, */
  },
}));

export default useStyles;
