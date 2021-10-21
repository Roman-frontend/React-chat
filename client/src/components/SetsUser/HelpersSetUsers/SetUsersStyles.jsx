import { colors } from '@mui/material';

export const styles = (theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    flexGrow: 1,
    fontSize: '4vh',
    textAlign: 'right',
    margin: 0,
  },
  buttonRoot: {
    padding: 0,
    width: '17px',
    height: '17px',
    minWidth: 0,
  },
});

export const styleIsNotActiveLink = {
  borderRadius: '0.4rem',
  background: colors.blue[900],
  padding: '0.5rem',
  margin: '0rem 1.5rem',
};

export const styleActiveLink = {
  padding: '0.5rem 2rem',
  background: colors.indigo[900],
};
