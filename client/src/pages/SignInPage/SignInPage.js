import React, { useCallback, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { colors } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { Formik, Form } from 'formik';
//https://github.com/jquense/yup  - Силка на додаткові методи yup
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { connect } from 'react-redux';
import { postData } from '../../redux/actions/actions.js';
import { POST_LOGIN } from '../../redux/types.js';
import { useAuth } from '../../hooks/auth.hook.js';
import { SignInForm } from '../../components/SignInForm/SignInForm.jsx';
import './auth-body.sass';

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
  const dispatch = useDispatch();
  const initialValues = { email: '', password: '' };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Required!'),
    password: Yup.string()
      .min(2, 'Too Short!')
      .max(15, 'Too Long')
      .required('Required'),
  });

  const onSubmit = async (values) => {
    try {
      const formData = { email: values.email, password: values.password };
      await dispatch(postData(POST_LOGIN, null, formData));
    } catch (e) {
      console.error(e);
    }
  };

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

const mapDispatchToProps = {
  postData,
};

export default connect(null, mapDispatchToProps)(SignInPage);
