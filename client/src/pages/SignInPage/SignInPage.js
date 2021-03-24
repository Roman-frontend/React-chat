import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { colors } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { Formik, Form } from 'formik';
//https://github.com/jquense/yup  - Силка на додаткові методи yup
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { useAuth } from '../../hooks/auth.hook.js';
import { SignInForm } from '../../components/SignInForm/SignInForm.jsx';
import './auth-body.sass';

const LOGIN = gql`
  query Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      name
      email
      channels
      directMessages
      token
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1, 2),
  },
  colors: {
    red: colors.red,
  },
}));

export const SignInPage = () => {
  const classes = useStyles();
  const { auth } = useAuth();
  const initialValues = { email: '', password: '' };
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const { loading, error, data, refetch } = useQuery(LOGIN, {
    variables: { email: loginData.email, password: loginData.password },
    onError(error) {
      console.log(`Некоректні дані при авторизації ${error}`);
    },
  });

  useEffect(() => {
    if (data && data.login) {
      const { id, name, email, channels, directMessages, token } = data.login;
      const authData = {
        userData: { _id: id, name, email, channels, directMessages },
        token,
      };
      auth(authData);
    }
  }, [data]);

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Required!'),
    password: Yup.string()
      .min(2, 'Too Short!')
      .max(15, 'Too Long')
      .required('Required'),
  });

  const onSubmit = (values) => {
    try {
      console.log({ email: values.email, password: values.password });
      setLoginData({ email: values.email, password: values.password });
      refetch();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <h1>Loading...</h1>;

  return (
    <div className='auth-body'>
      <Formik
        initialValues={initialValues}
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
        </Form>
      </Formik>
    </div>
  );
};
