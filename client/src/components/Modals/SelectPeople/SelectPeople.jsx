import React, { useState, useRef } from 'react';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { useSelector } from 'react-redux';
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
  const [listMatchedEmails, setListMatchedEmails] = useState(
    notInvitedRef.current
  );
  const users = useSelector((state) => state.users);
  const inputPeopleRef = useRef();
  const [open, setOpen] = useState(false);
  const [listPeoplesForInvite, setListPeoplesForInvite] = useState();
  const [invited, setInvited] = useState([]);

  const getSelectElements = () => {
    setOpen(true);
    if (listMatchedEmails) {
      setListPeoplesForInvite(createSelectElements(listMatchedEmails));
    }
  };

  function createSelectElements(peoplesForChoice) {
    return peoplesForChoice.map((people) => {
      return (
        <MenuItem
          key={people._id}
          label={people.email}
          value={people.email}
          onClick={() => addPeopleToInvited(people._id)}
        >
          {people.email}
        </MenuItem>
      );
    });
  }

  function addPeopleToInvited(idElectPeople) {
    setListMatchedEmails((prevList) => {
      return prevList.filter((people) => people._id !== idElectPeople);
    });
    if (users && users[0]) {
      const electData = users.filter((user) => user._id === idElectPeople);
      setInvited((prev) => prev.concat(electData));
    }
  }

  function handleInput(event) {
    changeListPeoples();
    if (event.key === 'Enter') {
      addToInvitedInputPeople();
      setListMatchedEmails(null);
    }
    setOpen(true);
  }

  function changeListPeoples() {
    const regExp = new RegExp(`${inputPeopleRef.current.value}`);
    setListMatchedEmails((prevList) => {
      return prevList.filter((people) =>
        people.email.match(regExp) ? people : undefined
      );
    });
  }

  function addToInvitedInputPeople() {
    const electPeople = listMatchedEmails.filter(
      (people) => people.email === inputPeopleRef.current.value
    );
    addPeopleToInvited(electPeople[0]._id);
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
            <Button color='primary' onClick={done}>
              Close
            </Button>
            <Button color='primary' onClick={() => done('done', invited)}>
              Done
            </Button>
          </DialogActions>
        </FormControl>
      </DialogContent>
    </div>
  );
});
