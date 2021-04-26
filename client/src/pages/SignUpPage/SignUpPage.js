import React, { useRef } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import { colors } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { useValidate } from '../../hooks/validate.hook.js';
import {
  validateName,
  validateEmail,
  validatePassword,
} from '../../components/Helpers/validateMethods.jsx';
import { useAuth } from '../../hooks/auth.hook.js';
import { SignUpForm } from '../../components/SignUpForm/SignUpForm.jsx';
import { ADD_USER, GET_USERS } from '../../components/GraphQL/queryes';
import {
  reactiveVarId,
  reactiveVarName,
  reactiveVarEmail,
  reactiveVarToken,
  reactiveVarChannels,
  reactiveDirectMessages,
} from '../../components/GraphQL/reactiveVariables';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1, 2),
  },
  colors: {
    red: colors.red,
  },
}));

export const SignUpPage = (props) => {
  const { auth } = useAuth();
  const classes = useStyles();
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
  const { loading: queryLoading, error, data } = useQuery(GET_USERS);
  //Коли ADD_USER мутація запущено, нещодавно доданий і повернений user обєкт зберігається в cache. Однак попередньо кешований список юзерів, спостерігаючий за GET_USERS запитом, не буде автоматично оновлено. Це означає, що запит GET_USERS не отримує сповіщення про те, що додано нового user, тому запит не буде оновлено, щоб показати нового user.
  const [addUser] = useMutation(ADD_USER, {
    //cache - представляє такі cache API методи: readQuery, writeQuery, readFragment, writeFragment, modify
    //data - містить результат мутації. Я можу застосувати data щоб оновити cache з cache.writeQuery, cache.writeFragment чи cache.modify.
    update(cache, { data: { addUser } }) {
      // cache.modify дозволяє обновляти чи удаляти пункти з кешу, застосовуючи функції модифікації.
      cache.modify({
        fields: {
          //застосовуємо функцію модифікатора users для оновлення кешованого масиву щоб включити посилання на нещодавно доданого user.
          users(existingUsers = []) {
            //За допомогою cache.writeFragment ми отримуємо внутрішнє посилання на доданий user, потім зберігаємо це посилання в масиві ROOT_QUERY.users.
            const newUserRef = cache.writeFragment({
              data: addUser,
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
    },
    onCompleted(data) {
      console.log(data.addUser);
      const { id, name, email, channels, directMessages, token } = data.addUser;
      const authData = {
        userData: { id, name, email, channels, directMessages },
        token,
      };
      reactiveVarToken(token);
      reactiveVarName(name);
      reactiveVarEmail(email);
      reactiveVarId(id);
      reactiveVarChannels(channels);
      reactiveDirectMessages(directMessages);
      auth(authData);
    },
  });

  const handleSubmit = async () => {
    const formData = {
      name: ref.name.current.children[1].children[0].value,
      email: ref.email.current.children[1].children[0].value,
      password: String(ref.password.current.children[1].children[0].value),
    };
    validate(formData);
    addUser({ variables: { ...formData } });
  };

  if (queryLoading) {
    console.log('loading queryLoading');
  }
  if (error) console.log(`error in SignUpPage --->>> ${error}`);
  if (data) console.log(data);

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
      </div>
    </div>
  );
};

export default SignUpPage;
