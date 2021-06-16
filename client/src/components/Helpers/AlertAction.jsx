import React, { useState, memo, useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const CustomizedSnackbars = memo((props) => {
  const { alertData, setAlertData } = props;
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState('success');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (alertData && alertData.status) {
      if (alertData.status === 'OK') {
        setType('success');
        setMessage(alertData.error.message);
      }
      if (alertData.status === 'SOME_INVITED') {
        setType('info');
        setMessage(alertData.error.message);
      }
      if (alertData.status === 'ALL_INVITED') {
        setType('error');
        setMessage(alertData.error.message);
      }
      setIsOpen(true);
    }
  }, [alertData]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setIsOpen(false);
    setAlertData({});
  };

  return (
    <div className={classes.root}>
      <Snackbar open={isOpen} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={type}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
});

export default CustomizedSnackbars;
