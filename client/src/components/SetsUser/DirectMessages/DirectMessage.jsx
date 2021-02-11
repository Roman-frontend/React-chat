import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connect } from 'react-redux';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useAuth } from '../../../hooks/auth.hook.js';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Button } from '@material-ui/core';
import { removeDirectMessages } from '../../../redux/actions/actions';
import { ACTIVE_CHAT_ID } from '../../../redux/types';
import { createDirectMsgName } from './ChatName.jsx';
import {
  styles,
  styleActiveLink,
  styleIsNotActiveLink,
} from './ChatStyles.jsx';

const ADD_USER = gql`
  mutation addUserMutation(
    $name: String!
    $email: String!
    $password: String!
  ) {
    addUser(name: $name, email: $email, password: $password) {
      id
      name
      email
      token
      errors
    }
  }
`;

const GET_USERS = gql`
  query {
    users {
      id
      name
      errors
    }
  }
`;

export const CreateLists = withStyles(styles)((props) => {
  const { reqRowElements, classes } = props;
  const { changeStorage } = useAuth();
  const dispatch = useDispatch();
  //const userData = useSelector((state) => state.userData);
  const userId = useSelector((state) => state.userData._id);
  const token = useSelector((state) => state.token);
  const [focusedId, setFocusedId] = useState(false);
  const [activeId, setActiveId] = useState(false);
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
                  errors
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
  });
  if (queryLoading)
    console.log('queryLoading with apollo-client...', queryLoading);
  if (error) console.log(`error in DirectMessages --->>> ${error}`);
  if (data) console.log(data);

  function createLink(linkData) {
    const id = linkData._id;
    const name = createDirectMsgName(linkData.invited.name);

    return (
      <div
        key={id}
        id={id}
        onMouseEnter={() => setFocusedId(id)}
        onMouseLeave={() => setFocusedId(false)}
        onClick={() => setActiveId(id)}
        className='main-font chatHover'
        style={activeId === id ? styleActiveLink : styleIsNotActiveLink}
      >
        <Grid
          container
          style={{
            alignItems: 'center',
          }}
        >
          <Grid item xs={10} onClick={() => toActive(id)}>
            {name}
          </Grid>
          <Grid
            item
            xs={2}
            style={{ display: focusedId === id ? 'flex' : 'none' }}
          >
            <Button
              variant='outlined'
              color='primary'
              size='small'
              style={{ background: 'white' }}
              classes={{ root: classes.buttonRoot }}
              onClick={() => showMore(id)}
            >
              X
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }

  function showMore(id) {
    const name = prompt('Input name');
    const email = prompt('Input email');
    const password = prompt('Input password');
    console.log({ name, email, password });
    addUser({ variables: { name, email, password } });
    console.log(data);
  }
  /*   function showMore(id) {
    if (token && userData && userData.directMessages) {
      const filteredUserDirectMessages = userData.directMessages.filter(
        (directMessageId) => {
          return directMessageId !== id;
        }
      );
      if (Array.isArray(filteredUserDirectMessages)) {
        const body = { userId, filteredUserDirectMessages };
        dispatch(removeDirectMessages(token, id, { ...body }));
      }
    }
  } */

  console.log(data);

  function toActive(idActive) {
    changeStorage({ lastActiveChatId: idActive });
    const payload = {
      activeChannelId: null,
      activeDirectMessageId: idActive,
    };
    dispatch({ type: ACTIVE_CHAT_ID, payload });
  }

  return reqRowElements.map((element) => createLink(element));
});

const mapDispatchToProps = { removeDirectMessages };

export default connect(null, mapDispatchToProps)(CreateLists);
