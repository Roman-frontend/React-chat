import React, { useMemo, useCallback } from 'react';
import {
  ThemeProvider,
  makeStyles,
  withStyles,
  createMuiTheme,
} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { colors } from '@material-ui/core';

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

const themeCorrect = createMuiTheme({
  palette: {
    primary: {
      main: colors.lime[900],
    },
  },
});

const themeError = createMuiTheme({
  palette: {
    primary: {
      main: colors.red[900],
    },
  },
});

export function SignUpForm(props) {
  const { label, type, id, name, fieldError = true, inputSignUpRef } = props;
  const classes = useStyles();
  console.log(fieldError === true);

  /*   const theme = createMuiTheme(
    fieldError === true
      ? {
          palette: {
            primary: {
              main: colors.lime[900],
            },
          },
        }
      : {
          palette: {
            primary: {
              main: colors.red[700],
            },
          },
        }
  ); */

  //console.log(theme);

  return (
    <div>
      <ThemeProvider theme={fieldError === true ? themeCorrect : themeError}>
        <TextField
          className={(classes.margin, classes.root)}
          style={{ width: '33.7vw', margin: '2vh 0vw' }}
          label={label}
          InputProps={
            fieldError === true
              ? { className: classes.inputIsValidated }
              : { className: classes.inputIsNotValidated }
          }
          name={name}
          type={type}
          id='mui-theme-provider-standard-input'
          ref={inputSignUpRef}
        />
      </ThemeProvider>
      <p
        className={
          fieldError === undefined || fieldError === true
            ? null
            : 'auth-form__error'
        }
      >
        {fieldError}
      </p>
    </div>
  );
}

{
  /* <label className="auth-form__form" htmlFor="email">{label}</label>
<input
  placeholder={placeholder}
  type={type}
  id={id}
  name={name}
  className={fieldError === true ? "auth-form__input-border-bottom-green " : "auth-form__input-border-bottom"}
  ref={inputSignUpRef}
/>
<p className={fieldError === undefined || fieldError === true ? null : "auth-form__error" }>
  {fieldError}
</p> */
}
