import React, { useRef, useMemo } from 'react';
import Modal from 'react-modal';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Link from '@material-ui/core/Link';
import { CreateListMembers } from './CreateListMembers';
Modal.setAppElement('#root');

const styles = (theme) => ({
  root: { flexGrow: 1, overflow: 'hidden' },
  buttonRoot: {
    padding: 0,
    width: '22px',
    minWidth: 0,
    margin: theme.spacing(1),
    float: 'right',
  },
  listRoot: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  inputRoot: { height: '6vh' },
  addPeoples: { padding: theme.spacing(0, 3), margin: 0, fontSize: 20 },
});

export const ConversationMembers = withStyles(styles)((props) => {
  const {
    activeChannel,
    modalIsShowsMembers,
    setModalIsShowsMembers,
    classes,
  } = props;
  const searchInputRef = useRef();

  const title = useMemo(() => {
    return (
      <p style={{ margin: 0 }}>
        {activeChannel ? activeChannel.members.length : 1} members in
        {activeChannel ? `#${activeChannel.name}` : '#general'}
      </p>
    );
  }, [activeChannel]);

  function handleInput(event) {
    const regExp = new RegExp(`${searchInputRef.current.value}`);
  }

  return (
    <div className='set-channel'>
      <Dialog
        open={modalIsShowsMembers}
        onClose={() => setModalIsShowsMembers(false)}
        aria-labelledby='form-dialog-title'
      >
        <div className={classes.root}>
          <Grid container spacing={1} style={{ alignItems: 'center' }}>
            <Grid item xs={10}>
              <DialogTitle id='form-dialog-title'>{title}</DialogTitle>
            </Grid>
            <Grid item xs={2}>
              <Button
                variant='contained'
                color='secondary'
                className={classes.buttonRoot}
                onClick={() => setModalIsShowsMembers(false)}
              >
                X
              </Button>
            </Grid>
          </Grid>
        </div>
        <Box>
          <Link
            className={classes.addPeoples}
            component='button'
            variant='body2'
            onClick={() => {
              console.info("I'm a button.");
            }}
          >
            Add people
          </Link>
        </Box>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            label='Search people'
            InputProps={{ className: classes.inputRoot }}
            style={{ width: '26rem' }}
            ref={searchInputRef}
            onKeyUp={(event) => handleInput(event)}
          />
          <CreateListMembers activeChannel={activeChannel} classes={classes} />
        </DialogContent>
      </Dialog>
    </div>
  );
});
