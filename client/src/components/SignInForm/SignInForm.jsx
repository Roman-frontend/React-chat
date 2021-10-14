import React from 'react';
import { Field, ErrorMessage } from 'formik';
import {
  ThemeProvider,
  makeStyles,
  createTheme,
} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { colors } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    background: colors.teal[50],
  },
  margin: {
    margin: theme.spacing(1),
  },
  input: {
    color: '#5f0937',
  },
}));

const theme = createTheme({
  palette: {
    primary: {
      main: colors.lime[800],
    },
  },
});

export function SignInForm(props) {
  const { label, type, name } = props;
  const classes = useStyles();

  return (
    <div>
      <Field name={name}>
        {(props) => {
          const { field, meta } = props;
          return (
            <>
              <ThemeProvider theme={theme}>
                <TextField
                  className={(classes.margin, classes.root)}
                  style={{ width: '33.7vw', margin: '2vh 0vw' }}
                  label={label}
                  //зупиняє анімацію
                  //InputLabelProps={{ shrink: true }}
                  InputProps={{
                    className: classes.input,
                  }}
                  name={name}
                  type={type}
                  {...field}
                  id='mui-theme-provider-standard-input'
                />
              </ThemeProvider>
            </>
          );
        }}
      </Field>
      <ErrorMessage
        name={name}
        render={(msg) => <div className='auth-form__error'>{msg}</div>}
      />
    </div>
  );
}
