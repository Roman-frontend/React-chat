import React, { useState, useRef, memo } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { makeStyles } from '@mui/styles';
import { colors } from '@mui/material';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { Link } from 'react-router-dom';
import { useValidate } from '../../hooks/validate.hook.js';
import {
  validateName,
  validateEmail,
  validatePassword,
} from '../../components/Helpers/validateMethods.jsx';
import { useAuth } from '../../hooks/auth.hook.js';
import { SignUpForm } from '../../components/SignUpForm/SignUpForm.jsx';
import { REGISTER } from '../../components/../GraphQLApp/queryes';
import { AuthLoader } from '../../components/Helpers/Loader.jsx';
import './auth-body.sass';

const useStyles = makeStyles((theme) => ({
  button: {
    //margin: theme.spacing(1, 2),
  },
  colors: {
    red: colors.red,
  },
}));

export const SignUpPage = memo((props) => {
  const { auth } = useAuth();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [serverError, setServerError] = useState(undefined);
  const { errors, validate } = useValidate({
    name: validateName,
    email: validateEmail,
    password: validatePassword,
  });

  const ref = {
    name: useRef(undefined),
    email: useRef(undefined),
    password: useRef(undefined),
  };

  const [register, { loading }] = useMutation(REGISTER, {
    update(cache, { data: { register } }) {
      cache.modify({
        fields: {
          users(existingUsers = []) {
            const newUserRef = cache.writeFragment({
              data: register.record,
              fragment: gql`
                fragment NewUser on User {
                  id
                  name
                  email
                }
              `,
            });
            return [...existingUsers, newUserRef];
          },
        },
      });
    },
    onError(error) {
      console.log(`Некоректні дані при реєстрації ${error}`);
      enqueueSnackbar('Failed registration!', { variant: 'error' });
    },
    onCompleted(data) {
      console.log('res data -- ', data);
      if (data.register.status === 'OK') {
        auth(data.register.record);
      }

      setServerError(data.register.error.message);
      enqueueSnackbar('Success registration!', { variant: 'success' });
    },
  });

  const handleSubmit = async (event) => {
    const formData = {
      name: ref.name.current.children[1].children[0].value,
      email: ref.email.current.children[1].children[0].value,
      password: String(ref.password.current.children[1].children[0].value),
    };
    ref.password.current.children[1].children[0].value = '';
    validate(formData);
    register({ variables: { ...formData } });
  };

  const handleCloseSnackbar = () => {
    setServerError(undefined);
  };

  return (
    <div className='auth-body'>
      <div className='auth-form'>
        <span className='auth-form__title'>Реєстрація</span>

        <SignUpForm
          label='Name'
          placeholder='Введите имя'
          id='name'
          name='name'
          fieldError={errors.name}
          type='name'
          inputSignUpRef={ref.name}
        />
        <SignUpForm
          label='Email'
          placeholder='Введите email'
          id='email'
          name='email'
          fieldError={errors.email}
          type='email'
          inputSignUpRef={ref.email}
        />
        <SignUpForm
          label='Password'
          placeholder='Введите пароль'
          id='password'
          name='password'
          fieldError={errors.password}
          type='password'
          inputSignUpRef={ref.password}
        />

        <Button
          size='small'
          variant='contained'
          color='primary'
          className={classes.button}
          style={{ backgroundColor: colors.lime[700], width: '9vw' }}
          onClick={handleSubmit}
        >
          Register
        </Button>

        <Link to={`/signIn`}>
          <Button size='small' variant='contained' className={classes.button}>
            Has account go to login
          </Button>
        </Link>

        {loading && <AuthLoader />}
        <Snackbar
          autoHideDuration={5000}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={serverError}
          onClose={handleCloseSnackbar}
          message={serverError}
        />
      </div>
    </div>
  );
});

export default SignUpPage;
