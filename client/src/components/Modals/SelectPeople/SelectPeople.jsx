import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import { Button } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Select from 'react-dropdown-select';
import { useTheme } from '@mui/material/styles';
import { GET_USERS } from '../../../GraphQLApp/queryes';
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

export const SelectPeople = (props) => {
  const { isDialogChanged, closePopap, done, isErrorInPopap, notInvitedRef } =
    props;
  const theme = useTheme();
  const [list, setList] = useState(notInvitedRef);
  const [invited, setInvited] = useState([]);
  const [minHeight, setMinHeight] = useState(120);
  const { data: allUsers } = useQuery(GET_USERS);

  const styles = {
    root: {
      minWidth: '400px',
      minHeight,
      maxHeight: '300px',
      margin: '0 auto',
      overflowY: 'hidden',
    },
    dialogContent: {
      padding: isDialogChanged ? '8px 24px' : 0,
    },
  };

  function todo() {
    done('done', invited /* invitedRef.current */);
  }

  function addPeopleToInvited(selected, addMethod) {
    addMethod(selected);
    const selectedIndex = list.indexOf(selected);
    if (allUsers && allUsers.users && allUsers.users[0]) {
      const electData = allUsers.users.filter(
        (user) => user.id === selected.id
      );
      setList((prevList) => {
        prevList.splice(selectedIndex, 1);
        return prevList;
      });
      setInvited((prev) => prev.concat(electData[0].id));
      //invitedRef.current = invitedRef.current.concat(electData[0].id);
    }
  }

  const itemRenderer = ({ item, itemIndex, props, state, methods }) => (
    <div
      key={item.id}
      style={{ background: theme.palette.primary.main }}
      onClick={() => addPeopleToInvited(item, methods.addItem)}
    >
      <div style={{ margin: '10px' }}>{item.email}</div>
    </div>
  );

  return (
    <div style={styles.root}>
      <StyledSelect
        placeholder='Select peoples'
        required={true}
        searchBy={'email'}
        separator={true}
        clearable={true}
        searchable={true}
        dropdownHandle={true}
        dropdownHeight={'120px'}
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
      />
      {isErrorInPopap ? (
        <p
          style={{
            fontSize: 12,
            paddingLeft: 4,
            marginTop: 6,
            color: 'red',
            fontWeight: 600,
          }}
        >
          required
        </p>
      ) : null}
      <DialogContent
        classes={{ root: styles.dialogContent }}
        style={{ position: 'absolute', bottom: 0 }}
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
              Add
            </Button>
          </DialogActions>
        </FormControl>
      </DialogContent>
    </div>
  );
};
