import React, { useCallback, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import Modal from 'react-modal';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Badge from '@material-ui/core/Badge';
import PersonIcon from '@material-ui/icons/Person';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Link from '@material-ui/core/Link';
Modal.setAppElement('#root');

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    overflow: 'hidden',
  },
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
  inputRoot: {
    height: '6vh',
  },
  addPeoples: {
    padding: theme.spacing(0, 3),
    margin: 0,
    fontSize: 20,
  },
});

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: '$ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}))(Badge);

export const ConversationMembers = withStyles(styles)((props) => {
  const {
    activeChannel,
    modalIsShowsMembers,
    setModalIsShowsMembers,
    classes,
  } = props;
  const users = useSelector((state) => state.users);
  const usersOnline = useSelector((state) => state.usersOnline);
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

  const createListMembers = useCallback(() => {
    const listMembers = getMembersActiveChannel();
    return (
      <List dense className={classes.root}>
        {listMembers.map((member) => {
          return (
            <ListItem key={member._id} button>
              <ListItemAvatar>
                <StyledBadge
                  overlap='circle'
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  variant={usersOnline.includes(member._id) ? 'dot' : 'none'}
                >
                  <Box>
                    <PersonIcon
                      style={{ fontSize: 30, background: 'cadetblue' }}
                      alt='icon-user'
                    />
                  </Box>
                </StyledBadge>
              </ListItemAvatar>
              <ListItemText id={member._id} primary={member.email} />
            </ListItem>
          );
        })}
      </List>
    );
  }, [activeChannel, usersOnline]);

  function getMembersActiveChannel() {
    let listMembers = [];

    if (activeChannel && users && users[0]) {
      const allUsers = users;
      activeChannel.members.forEach((memberId) => {
        const filteredUsers = allUsers.filter(
          (member) => member._id === memberId
        );
        listMembers = listMembers.concat(filteredUsers);
      });
    }

    return listMembers;
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
          {createListMembers()}
        </DialogContent>
      </Dialog>
    </div>
  );
});
