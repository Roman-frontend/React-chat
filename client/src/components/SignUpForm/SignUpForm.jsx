import React from 'react';
import { makeStyles } from '@mui/styles';
import TextField from '@mui/material/TextField';
import { colors } from '@mui/material';
import './auth-form.sass';

const useStyles = makeStyles((theme) => ({
  inputIsValidated: {
    color: colors.lime[900],
  },
  inputIsNotValidated: {
    color: colors.red[900],
  },
  label: {
    margin: '0px 14px',
  },
}));

export function SignUpForm(props) {
  const { label, type, name, fieldError = true, inputSignUpRef } = props;
  const classes = useStyles();
  const isError =
    fieldError === undefined || fieldError === true ? false : true;

  return (
    <div>
      <TextField
        style={{ width: '33.7vw' }}
        label={label}
        name={name}
        type={type}
        InputLabelProps={{
          classes: { standard: classes.label },
        }}
        ref={inputSignUpRef}
        error={isError}
        size='small'
        variant='standard'
      />
      <p className={isError ? 'auth-form__error' : null}>{fieldError}</p>
    </div>
  );
}
