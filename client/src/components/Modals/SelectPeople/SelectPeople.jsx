import React, { useState, useRef } from 'react';
import { useQuery } from '@apollo/client';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { GET_USERS } from '../../../GraphQLApp/queryes';
import './select-people.sass';

const styles = (theme) => ({
  input: {
    height: '6vh',
    width: '33vw',
  },
  selectMenu: {
    height: '8vh',
  },
  selectRoot: {
    display: 'table',
    width: '31vw',
  },
});

export const SelectPeople = withStyles(styles)((props) => {
  const { notInvitedRef, done, classes } = props;
  const [list, setList] = useState(notInvitedRef.current);
  const inputPeopleRef = useRef();
  const invitedRef = useRef([]);
  const [open, setOpen] = useState(false);
  const [listPeoplesForInvite, setListPeoplesForInvite] = useState();
  const { data: allUsers } = useQuery(GET_USERS);

  const getSelectElements = () => {
    setOpen(true);
    if (list) {
      setListPeoplesForInvite(createSelectElements(list));
    }
  };

  function createSelectElements(peoplesForChoice) {
    return peoplesForChoice.map(({ id, email }) => {
      return (
        <MenuItem
          key={id}
          label={email}
          value={email}
          onClick={() => addPeopleToInvited(id)}
        >
          {email}
        </MenuItem>
      );
    });
  }

  function addPeopleToInvited(idElectPeople) {
    setList((prevList) => {
      return prevList.filter((people) => people.id !== idElectPeople);
    });
    if (allUsers && allUsers.users && allUsers.users[0]) {
      const electData = allUsers.users.filter(
        (user) => user.id === idElectPeople
      );
      invitedRef.current = invitedRef.current.concat(electData[0].id);
    }
  }

  function handleInput(event) {
    changeListPeoples();
    if (event.key === 'Enter') {
      addToInvitedInputPeople();
      setList(null);
    }
    setOpen(true);
  }

  function changeListPeoples() {
    const regExp = new RegExp(`${inputPeopleRef.current.value}`);
    setList((prevList) => {
      return prevList.filter((people) =>
        people.email.match(regExp) ? people : undefined
      );
    });
  }

  function addToInvitedInputPeople() {
    const electPeople = list.filter(
      (people) => people.email === inputPeopleRef.current.value
    );
    addPeopleToInvited(electPeople[0].id);
    inputPeopleRef.current.value = '';
  }

  return (
    <div>
      <DialogContent>
        <FormControl style={{ width: '33vw' }}>
          <TextField
            label='Add a people'
            InputProps={{
              className: classes.input,
            }}
            id='mui-theme-provider-standard-input'
            ref={inputPeopleRef}
            onKeyUp={(event) => handleInput(event)}
          />

          <InputLabel
            id='demo-controlled-open-select-label'
            style={{ top: '8vh' }}
          >
            List peoples
          </InputLabel>
          <Select
            labelId='demo-mutiple-name-label'
            id='demo-mutiple-name'
            open={open}
            onClose={() => setOpen(false)}
            onOpen={getSelectElements}
            value=''
            classes={{ root: classes.selectRoot }}
            className={classes.selectMenu}
          >
            {listPeoplesForInvite}
          </Select>
          <DialogActions>
            <Button color='secondary' onClick={done}>
              Close
            </Button>
            <Button
              color='primary'
              onClick={() => done('done', invitedRef.current)}
            >
              Done
            </Button>
          </DialogActions>
        </FormControl>
      </DialogContent>
    </div>
  );
});
