import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import { Select } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core';
import { GET_USERS } from '../../../GraphQLApp/queryes';
import './select-people.sass';
import { red } from '@material-ui/core/colors';
//коли відкриваю попап створення чату і нічого не заповняю, нажимаю done і воно просто закриває попап має показати шо є якісь обовязкові поля

const styles = (theme) => ({
  input: {
    height: '30px',
    width: '33vw',
    color: '#0000b5',
  },
  selectMenu: {
    height: '35px',
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

const helperTextStyles = makeStyles((theme) => ({
  root: {
    margin: 4,
  },
  error: {
    '&.MuiFormHelperText-root.Mui-error': {
      color: red[500],
    },
  },
}));

const selectStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: '120px',
    margin: 0,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  menuPaper: {
    maxHeight: 190,
  },
}));

export const SelectPeople = withStyles(styles)((props) => {
  const {
    isDialogChanged,
    closePopap,
    notInvitedRef,
    done,
    isErrorInPopap,
    classes,
  } = props;
  const helperTestClasses = helperTextStyles();
  const selectClasses = selectStyles();
  const dialogClasses = isDialogChanged
    ? popapWithoutPadding()
    : popapWithPadding();
  const [list, setList] = useState(notInvitedRef.current);
  const inputPeopleRef = useRef();
  const invitedRef = useRef([]);
  const textRef = useRef();
  const [open, setOpen] = useState(false);
  const [isChoosedSeveral, setIsChosedSeveral] = useState(false);
  const { data: allUsers } = useQuery(GET_USERS);

  useEffect(() => {
    if (open) {
      getSelectElements();
    }
  }, [open]);

  function close() {
    closePopap();
  }

  function todo() {
    done('done', invitedRef.current);
  }

  const getSelectElements = () => {
    if (list) {
      return createSelectElements(list);
    }
  };

  function createSelectElements(peoplesForChoice) {
    return peoplesForChoice.map((people) => {
      return (
        <MenuItem
          key={people.id}
          label={people.email}
          value={people.email}
          onClick={() => addPeopleToInvited(people)}
        >
          {people.email}
        </MenuItem>
      );
    });
  }

  function addPeopleToInvited(selected) {
    console.log('todo', selected);
    const selectedIndex = list.indexOf(selected);
    setList((prevList) => {
      prevList.splice(selectedIndex, 1);
      return prevList;
    });
    if (allUsers && allUsers.users && allUsers.users[0]) {
      const electData = allUsers.users.filter(
        (user) => user.id === selected.id
      );
      invitedRef.current = invitedRef.current.concat(electData[0].id);
    }
  }

  function handleInput(event) {
    const regExp = new RegExp(`${event.target.value}`, 'gi');
    const selected = notInvitedRef.current.filter(
      (people) => people.email.match(regExp) && people
    );
    setList(selected);
    const choosed = notInvitedRef.current.filter((people) => {
      return people.email === event.target.value;
    });
    const selectedIsInvited = invitedRef.current.includes(choosed[0]);
    if (event.key === 'Enter' && !selectedIsInvited) {
      if (choosed.length !== 1) {
        console.log(choosed, notInvitedRef.current);
        setIsChosedSeveral(true);
      } else {
        setIsChosedSeveral(false);
        addPeopleToInvited(choosed[0]);
      }
    }
    textRef.current.focus();
  }

  function handleOpenSelect() {
    setOpen(true);
    textRef.current.focus();
  }

  return (
    <div>
      <DialogContent classes={{ root: dialogClasses.root }}>
        <FormControl className={selectClasses.formControl}>
          <TextField
            InputProps={{ className: classes.input }}
            label='Add a people'
            id='mui-theme-provider-standard-input'
            ref={inputPeopleRef}
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
            }}
            onKeyUp={(event) => handleInput(event)}
            helperText={
              isErrorInPopap
                ? 'required'
                : isChoosedSeveral
                ? 'Please choose one persone'
                : ''
            }
            FormHelperTextProps={{ classes: helperTestClasses }}
            required={true}
            ref={textRef}
            autoFocus={true}
            error
          />

          <InputLabel
            id='demo-controlled-open-select-label'
            style={{ top: '8vh' }}
          >
            List peoples
          </InputLabel>
          <Select
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            open={open}
            onClose={() => setOpen(false)}
            onOpen={handleOpenSelect}
            classes={{ root: classes.selectRoot }}
            className={classes.selectMenu}
            value={list[0] ? list[0].email : ''}
            MenuProps={{ classes: { paper: selectClasses.menuPaper } }}
            error
          >
            {getSelectElements()}
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
