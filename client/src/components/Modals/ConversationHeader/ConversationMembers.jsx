import React, { useCallback, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-modal';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
Modal.setAppElement('#root');

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  button: {
    margin: theme.spacing(1),
    float: 'right',
  },
  addPeoples: {
    padding: theme.spacing(1),
    margin: 0,
    fontSize: 20,
  },
}));

export function ConversationMembers(props) {
  const { activeChannel, modalIsShowsMembers, setModalIsShowsMembers } = props;
  const classes = useStyles();
  const users = useSelector((state) => state.users);
  const searchInputRef = useRef();

  const headerPopup = useMemo(() => {
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

    return listMembers.map((member) => {
      return (
        <div key={member._id} id={member._id} className='user-sets__people'>
          <b className='main-font user-sets__people_color'>{member.email}</b>
        </div>
      );
    });
  }, [activeChannel]);

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
    <Modal
      isOpen={modalIsShowsMembers}
      onRequestClose={() => setModalIsShowsMembers(false)}
      className={'modal-content'}
      overlayClassName={'modal-overlay-conversation-header-members'}
    >
      <div className='set-channel'>
        <div className={classes.root}>
          <Grid container spacing={1} style={{ alignItems: 'center' }}>
            <Grid item xs={10}>
              {headerPopup}
            </Grid>
            <Grid item xs={2}>
              <Button
                variant='contained'
                color='secondary'
                className={classes.button}
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
        <input
          placeholder='search people'
          style={{ width: '27.1rem' }}
          type='text'
          ref={searchInputRef}
          onKeyUp={(event) => handleInput(event)}
        />
        {createListMembers()}
      </div>
    </Modal>
  );
}
