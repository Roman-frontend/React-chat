import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
//https://github.com/jquense/yup  - Силка на додаткові методи yup
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useSnackbar } from 'notistack';
import clsx from 'clsx';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { colors, Paper } from '@mui/material';
import Button from '@mui/material/Button';
import { LOGIN } from '../../components/../GraphQLApp/queryes';
import { useAuth } from '../../hooks/auth.hook.js';
import { SignInForm } from '../../components/SignInForm/SignInForm.jsx';
import { AuthLoader } from '../../components/Helpers/Loader';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import OutlinedInput from '@mui/material/OutlinedInput';
import Visibility from '@mui/icons-material/Visibility';
import { Box } from '@mui/system';

const useStyles = makeStyles((theme) => ({
  rootInput: {
    background: colors.teal[50],
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    //margin: theme.spacing(1),
  },
  textField: {
    width: '25ch',
  },

  colors: {
    red: colors.red,
  },
  input: {
    color: '#5f0937',
  },
}));

export const SignInPage = ({ route }) => {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState(null);
  const [valuess, setValuess] = useState({
    password: '',
    showPassword: false,
  });
  const handleChange = (prop) => (event) => {
    setPassword(event.target.value);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const prevHandleChange = (prop) => (event) => {
    setValuess({ ...valuess, [prop]: event.target.value });
  };

  const prevHandleClickShowPassword = () => {
    setValuess({ ...valuess, showPassword: !valuess.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const classes = useStyles();
  const { auth } = useAuth();
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [stopLogin, setStopLogin] = useState(true);

  const { loading, refetch } = useQuery(LOGIN, {
    //Вимкнути автоматичний логін
    skip: stopLogin,
    variables: { email: loginData.email, password: loginData.password },

    //variables: { email: 'test@mail.ru', password: '11111111' },
    onError(error) {
      console.log(`Помилка авторизації ${error}`);
      enqueueSnackbar('Fail login', { variant: 'error' });
    },
    onCompleted(data) {
      if (data.login.status === 'OK') {
        auth(data.login.record);
        enqueueSnackbar('Successful login', { variant: 'success' });
      } else {
        enqueueSnackbar(data.login.error.message, { variant: 'error' });
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
      setLoginData({ email: values.email, password: valuess.password });
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
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Paper
        sx={{
          position: 'relative',
          top: '15vh',
          background: theme.palette.primary.dark,
        }}
      >
        <Formik
          initialValues={{ email: '', password: '' }}
          //validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form>
            <span
              style={{
                display: 'flex',
                justifyContent: 'center',
                fontSize: 25,
                margin: '20px 0px 0px',
              }}
            >
              Авторизація
            </span>

            <SignInForm label='Email' name='email' type='email' />
            <>
              <Field name='password'>
                {(props) => {
                  return (
                    <>
                      <FormControl
                        name='password'
                        style={{ width: '33.7vw' }}
                        id='password'
                        color='input'
                      >
                        <InputLabel>Password</InputLabel>
                        <Input
                          type={valuess.showPassword ? 'text' : 'password'}
                          //value={values.password}
                          onChange={prevHandleChange('password')}
                          endAdornment={
                            <InputAdornment position='end'>
                              <IconButton
                                aria-label='toggle password visibility'
                                onClick={prevHandleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                              >
                                {valuess.showPassword ? (
                                  <Visibility />
                                ) : (
                                  <VisibilityOff />
                                )}
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                    </>
                  );
                }}
              </Field>
            </>
            <ErrorMessage
              name='password'
              render={(msg) => <div className='auth-form__error'>{msg}</div>}
            />
            <Box style={{ display: 'flex' }}>
              <Button
                size='small'
                variant='contained'
                color='primary'
                style={{
                  width: '9vw',
                  margin: '15px',
                }}
                type='submit'
              >
                Enter
              </Button>

              <Link to={`/signUp`} style={{ textDecoration: 'none' }}>
                <Button
                  size='small'
                  color='secondary'
                  variant='contained'
                  sx={{ margin: '15px' }}
                >
                  Go to register
                </Button>
              </Link>
            </Box>
            {loading ? <AuthLoader /> : null}
          </Form>
        </Formik>
      </Paper>
    </div>
  );
};
