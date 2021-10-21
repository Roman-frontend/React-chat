import React from 'react';
import { makeStyles } from '@mui/styles';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';

const useAppStyles = makeStyles((theme) => ({
  root: { position: 'fixed', left: '50%', top: '50%' },
}));

export const Loader = () => {
  const classes = useAppStyles();
  return (
    <div className={classes.root}>
      <CircularProgress color='secondary' />
    </div>
  );
};

const useAuthStyles = makeStyles((theme) => ({
  root: {
    width: '34vw',
    '& > * + *': {
      //marginTop: theme.spacing(2),
    },
  },
}));

export function AuthLoader() {
  const classes = useAuthStyles();

  return (
    <div className={classes.root}>
      <LinearProgress />
      <LinearProgress color='secondary' />
    </div>
  );
}
