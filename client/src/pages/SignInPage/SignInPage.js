import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { colors } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { Formik, Form } from 'formik';
//https://github.com/jquense/yup  - Силка на додаткові методи yup
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { LOGIN } from '../../components/../GraphQLApp/queryes';
import { useAuth } from '../../hooks/auth.hook.js';
import { SignInForm } from '../../components/SignInForm/SignInForm.jsx';
import { AuthLoader } from '../../components/Helpers/Loader';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1, 2),
  },
  colors: {
    red: colors.red,
  },
}));

export const SignInPage = ({ route }) => {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const { auth } = useAuth();
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [stopLogin, setStopLogin] = useState(true);

  const { loading, refetch } = useQuery(LOGIN, {
    skip: stopLogin,
    variables: { email: loginData.email, password: loginData.password },
    onError(error) {
      console.log(`Помилка авторизації ${error}`);
    },
    onCompleted(data) {
      console.log(data);
      if (data.login.status === 'OK') {
        auth(data.login.record);
      } else {
        enqueueSnackbar(data.login.error.message, {
          variant: 'error',
        });
      }
    },
  });

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Required!'),
    password: Yup.string()
      .min(2, 'Too Short!')
      .max(15, 'Too Long')
      .required('Required'),
  });

  const onSubmit = (values, { resetForm }) => {
    try {
      setLoginData({ email: values.email, password: values.password });
      resetForm({
        values: {
          email: values.email,
          password: '',
        },
      });
      setStopLogin(false);
      refetch();
    } catch (e) {
      console.error('Помилочка : ', e);
    }
  };

  return (
    <div className='auth-body'>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <Form className='auth-form'>
          <span className='auth-form__title'>Авторизація</span>

          <SignInForm
            label='Email'
            placeholder='Введите email'
            id='email'
            name='email'
            type='email'
          />
          <SignInForm
            label='Password'
            placeholder='Введите password'
            id='password'
            name='password'
            type='password'
          />
          <Button
            size='small'
            variant='contained'
            color='primary'
            className={classes.button}
            style={{ backgroundColor: colors.lime[700], width: '9vw' }}
            type='submit'
          >
            Enter
          </Button>

          <Link to={`/signUp`}>
            <Button size='small' variant='contained' className={classes.button}>
              Go to register
            </Button>
          </Link>
          {loading && <AuthLoader />}
        </Form>
      </Formik>
    </div>
  );
};
