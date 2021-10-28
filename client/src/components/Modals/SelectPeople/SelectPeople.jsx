import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Button } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { makeStyles } from '@mui/styles';
import { GET_USERS } from '../../../GraphQLApp/queryes';
import styled from '@emotion/styled';
import './select-people.sass';
import Select from 'react-dropdown-select';
import { useTheme } from '@mui/material/styles';
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

export const SelectPeople = (props) => {
  const {
    isDialogChanged,
    closePopap,
    done,
    isErrorInPopap,
    classes,
    notInvitedRef,
  } = props;
  console.log(isDialogChanged, closePopap, done, notInvitedRef.current);
  const theme = useTheme();
  const dialogClasses = isDialogChanged
    ? popapWithoutPadding()
    : popapWithPadding();
  const [list, setList] = useState(notInvitedRef);
  const [invited, setInvited] = useState([]);
  const [minHeight, setMinHeight] = useState(120);
  const { data: allUsers } = useQuery(GET_USERS);

  function todo() {
    done('done', invited /* invitedRef.current */);
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

  const itemRenderer = ({ item, itemIndex, props, state, methods }) => (
    <div
      key={item.id}
      onClick={() => addPeopleToInvited(item, methods.addItem)}
    >
      <div style={{ margin: '10px' }}>{item.email}</div>
    </div>
  );

  console.log(list);

  return (
    <div
      style={{
        minWidth: '400px',
        minHeight,
        maxHeight: '230px',
        margin: '0 auto',
        overflowY: 'hidden',
      }}
    >
      <StyledSelect
        placeholder='Select peoples'
        required={true}
        searchBy={'email'}
        separator={true}
        clearable={true}
        searchable={true}
        dropdownHandle={true}
        dropdownHeight={'300px'}
        direction={'ltr'}
        multi={true}
        labelField={'email'}
        valueField={'email'}
        options={list}
        dropdownGap={5}
        keepSelectedInList={true}
        onDropdownOpen={() => setMinHeight(240)}
        onDropdownClose={() => setMinHeight(120)}
        onClearAll={() => undefined}
        onSelectAll={() => undefined}
        noDataLabel='No matches found'
        closeOnSelect={false}
        dropdownPosition={'bottom'}
        itemRenderer={itemRenderer}
        style={{
          background: theme.palette.primary.light,
          color: theme.palette.text.select,
        }}
      />
      <DialogContent
        classes={{ root: dialogClasses.root }}
        style={{ textAlign: 'right' }}
      >
        <FormControl>
          <DialogActions>
            <Button
              size='small'
              variant='contained'
              color='error'
              onClick={closePopap}
            >
              Close
            </Button>
            <Button
              size='small'
              variant='contained'
              color='secondary'
              onClick={todo}
            >
              Done
            </Button>
          </DialogActions>
        </FormControl>
      </DialogContent>
    </div>
  );
};
