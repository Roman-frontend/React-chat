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
import { makeStyles } from '@material-ui/core';
import { GET_USERS } from '../../../GraphQLApp/queryes';
import './select-people.sass';

//коли відкриваю попап створення чату і нічого не заповняю, нажимаю done і воно просто закриває попап має показати шо є якісь обовязкові поля

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

const popapWithoutPadding = makeStyles((theme) => ({
  root: {
    padding: 0,
  },
}));

const popapWithPadding = makeStyles((theme) => ({
  root: {
    padding: '8px 24px',
  },
}));

export const SelectPeople = withStyles(styles)((props) => {
  const { isDialogChanged, closePopap, notInvitedRef, done, classes } = props;
  const dialogClasses = isDialogChanged
    ? popapWithoutPadding()
    : popapWithPadding();
  const [list, setList] = useState(notInvitedRef.current);
  const inputPeopleRef = useRef();
  const invitedRef = useRef([]);
  const [open, setOpen] = useState(false);
  const [isFailDone, setIsFailDone] = useState(false);
  const [listPeoplesForInvite, setListPeoplesForInvite] = useState();
  const { data: allUsers } = useQuery(GET_USERS);

  function close() {
    closePopap();
    setIsFailDone(false);
  }

  function todo() {
    done('done', invitedRef.current);
    if (invitedRef.current[0]) {
      setIsFailDone(false);
    } else {
      setIsFailDone(true);
    }
  }

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
      <DialogContent classes={{ root: dialogClasses.root }}>
        <FormControl style={{ width: '33vw' }}>
          <TextField
            label='Add a people'
            InputProps={{
              className: classes.input,
            }}
            id='mui-theme-provider-standard-input'
            ref={inputPeopleRef}
            onKeyUp={(event) => handleInput(event)}
            helperText={isFailDone ? 'required' : ''}
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
            classes={{ root: classes.selectRoot }}
            className={classes.selectMenu}
          >
            {listPeoplesForInvite}
          </Select>
          <DialogActions>
            <Button onClick={close}>Close</Button>
            <Button onClick={todo}>Done</Button>
          </DialogActions>
        </FormControl>
      </DialogContent>
    </div>
  );
});
