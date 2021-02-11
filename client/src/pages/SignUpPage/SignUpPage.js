import React, { useRef } from 'react';
//import { useQuery, gql } from '@apollo/client';
//import { useQuery, gql } from 'react-apollo';
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
//import withHocs from './SignUpHoc';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1, 2),
  },
  colors: {
    red: colors.red,
  },
}));
/* 
const GET_USERS = gql`
  query {
    users {
      id
      name
    }
  }
`; */

export const SignUpPage = (props) => {
  const { addUser, deleteUser, updateUser, data } = props;
  //const { loading, error } = useQuery(GET_USERS);
  const { register } = useAuth();
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

  const handleSubmit = async () => {
    console.log(addUser);
    const formData = {
      name: ref.name.current.children[1].children[0].value,
      email: ref.email.current.children[1].children[0].value,
      password: String(ref.password.current.children[1].children[0].value),
    };
    validate(formData);
    try {
      console.log(formData);
      //addUser({ ...formData });
      console.log(props.data);
      //register(formData);
    } catch (e) {
      console.log('Помилка при реєстрації -', e);
    }
  };

  const handleRemove = () => {
    const removeId = prompt('Введите id юзера для видалення!');
    deleteUser({ id: removeId });
  };

  const handleUpdate = () => {
    const name = ref.name.current.children[1].children[0].value;
    const removeId = prompt('Введите name юзера для оновлення!!');
    updateUser({ id: removeId, name });
  };

  const handleFilter = () => {
    /*     const regExp = prompt('Введите name юзера для оновлення!!');
    data.fetchMore({
      variables: { name: regExp },
      updateQuery: (previousResult, { fetchMoreResult }) => fetchMoreResult,
    });
    console.log(data); */
  };

  /*   return (
    <Query query={GET_MOVIES}>
      {({ loading, error, data }) => {
        if (loading) return <div>Loading...</div>;
        if (error) return <div>{`${error}`}</div>;

        return <h1>yes</h1>;
      }}
    </Query>
  ); */

  /*   if (loading) return <p>Loading with apollo-client...</p>;
  if (error) return <p>{`${error}`}</p>; */

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

        <Button
          size='small'
          variant='contained'
          color='primary'
          className={classes.button}
          style={{ backgroundColor: colors.lime[700], width: '9vw' }}
          onClick={handleFilter}
        >
          Filter
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

//export default withHocs(SignUpPage);
export default SignUpPage;
