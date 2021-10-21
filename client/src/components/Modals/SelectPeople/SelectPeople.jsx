import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { useQuery } from '@apollo/client';
import { withStyles } from '@mui/styles';
import InputLabel from '@mui/material/InputLabel';
import { Select as MUISelect } from '@mui/material';
import { Button as MUIButton } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { makeStyles } from '@mui/styles';
import { GET_USERS } from '../../../GraphQLApp/queryes';
import styled from '@emotion/styled';
import './select-people.sass';
import { red } from '@mui/material/colors';
import SelectSearch from 'react-select-search';
import Select from 'react-dropdown-select';
//коли відкриваю попап створення чату і нічого не заповняю, нажимаю done і воно просто закриває попап має показати шо є якісь обовязкові поля

const StyledSelect = styled(Select)`
  ${({ dropdownRenderer }) =>
    dropdownRenderer &&
    `
		.react-dropdown-select-dropdown {
			overflow: initial;
		}
	`}
`;

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
    //marginTop: theme.spacing(2),
  },
  menuPaper: {
    maxHeight: 190,
  },
}));

export const SelectPeople = withStyles(styles)((props) => {
  const {
    isDialogChanged,
    closePopap,
    done,
    isErrorInPopap,
    classes,
    notInvitedRef,
  } = props;
  const helperTestClasses = helperTextStyles();
  const selectClasses = selectStyles();
  const dialogClasses = isDialogChanged
    ? popapWithoutPadding()
    : popapWithPadding();
  const [list, setList] = useState(notInvitedRef);
  //const inputPeopleRef = useRef();
  //const invitedRef = useRef([]);
  const [invited, setInvited] = useState([]);
  const [open, setOpen] = useState(false);
  const [isChoosedSeveral, setIsChosedSeveral] = useState(false);
  const { data: allUsers } = useQuery(GET_USERS);

  const [selectValues, setSelectValues] = useState([]);

  useEffect(() => {
    if (open) {
      getSelectElements();
    }
  }, [open]);

  function close() {
    closePopap();
  }

  function todo() {
    done('done', invited /* invitedRef.current */);
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

  function addPeopleToInvited(selected, addMethod) {
    addMethod(selected);
    console.log('todo', selected);
    const selectedIndex = list.indexOf(selected);
    if (allUsers && allUsers.users && allUsers.users[0]) {
      const electData = allUsers.users.filter(
        (user) => user.id === selected.id
      );
      setList((prevList) => {
        prevList.splice(selectedIndex, 1);
        return prevList;
      });
      console.log(selected);
      setInvited((prev) => prev.concat(electData[0].id));
      //invitedRef.current = invitedRef.current.concat(electData[0].id);
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
    //const selectedIsInvited = invitedRef.current.includes(choosed[0]);
    const selectedIsInvited = invited.includes(choosed[0]);
    if (event.key === 'Enter' && !selectedIsInvited) {
      if (choosed.length !== 1) {
        console.log(choosed, notInvitedRef.current);
        setIsChosedSeveral(true);
      } else {
        setIsChosedSeveral(false);
        addPeopleToInvited(choosed[0]);
      }
    }
  }

  function handleOpenSelect() {
    setOpen(true);
  }

  const itemRenderer = ({ item, itemIndex, props, state, methods }) => (
    <div
      key={item.id}
      onClick={() => addPeopleToInvited(item, methods.addItem)}
    >
      <div style={{ margin: '10px' }}>{item.email}</div>
    </div>
  );

  return (
    <div>
      <div
        style={{
          minWidth: '400px',
          minHeight: '195px',
          maxHeight: '230px',
          margin: '0 auto',
        }}
      >
        <StyledSelect
          placeholder='Select peoples'
          color={'#0074D9'}
          required={true}
          autoFocus={true}
          searchBy={'email'}
          separator={true}
          clearable={true}
          searchable={true}
          keepOpen={false}
          dropdownHandle={true}
          dropdownHeight={'300px'}
          direction={'ltr'}
          multi={true}
          labelField={'email'}
          valueField={'email'}
          options={list}
          dropdownGap={5}
          keepSelectedInList={true}
          onDropdownOpen={() => undefined}
          onDropdownClose={() => undefined}
          onClearAll={() => undefined}
          onSelectAll={() => undefined}
          onChange={(values) => setSelectValues(values)}
          noDataLabel='No matches found'
          closeOnSelect={false}
          dropdownPosition={'bottom'}
          itemRenderer={itemRenderer}
        />
      </div>
      <DialogContent classes={{ root: dialogClasses.root }}>
        <FormControl className={selectClasses.formControl}>
          <DialogActions>
            <MUIButton onClick={close}>Close</MUIButton>
            <MUIButton onClick={todo}>Done</MUIButton>
          </DialogActions>
        </FormControl>
      </DialogContent>
    </div>
  );
});
