import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { makeStyles } from '@mui/styles';
import TextField from '@mui/material/TextField';

const useStyles = makeStyles((theme) => ({
  label: {
    margin: '0px 14px',
  },
}));

export function SignInForm(props) {
  const { label, type, name, autoFocus } = props;
  const classes = useStyles();

  return (
    <div>
      <Field name={name}>
        {(props) => {
          const { field, meta } = props;
          return (
            <>
              <TextField
                style={{ width: '33.7vw', margin: '2vh 0vw' }}
                variant='standard'
                InputLabelProps={{
                  classes: { standard: classes.label },
                }}
                label={label}
                color='input'
                //зупиняє анімацію
                //InputLabelProps={{ shrink: true }}
                autoFocus={autoFocus}
                name={name}
                type={type}
                {...field}
                id='mui-theme-provider-standard-input'
              />
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
