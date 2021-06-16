import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { colors } from '@material-ui/core';
import './auth-form.sass';

const useStyles = makeStyles((theme) => ({
  root: {
    background: colors.teal[50],
  },
  margin: {
    margin: theme.spacing(1),
  },
  inputIsValidated: {
    color: colors.lime[900],
  },
  inputIsNotValidated: {
    color: colors.red[900],
  },
}));

export function SignUpForm(props) {
  const { label, type, id, name, fieldError = true, inputSignUpRef } = props;
  const classes = useStyles();
  const isError =
    fieldError === undefined || fieldError === true ? false : true;

  console.log(inputSignUpRef);

  return (
    <div>
      <TextField
        className={(classes.margin, classes.root)}
        style={{ width: '33.7vw', margin: '2vh 0vw' }}
        label={label}
        name={name}
        type={type}
        id='mui-theme-provider-standard-input'
        ref={inputSignUpRef}
        error={isError}
        size='small'
      />
      <p className={isError ? 'auth-form__error' : null}>{fieldError}</p>
    </div>
  );
}
