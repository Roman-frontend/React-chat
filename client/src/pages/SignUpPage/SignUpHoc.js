import { compose } from 'recompose';
import { graphql } from 'react-apollo';

import {
  addUserMutation,
  deleteUserMutation,
  updateUserMutation,
} from './mutations';
import { usersQuery, filteredUsersQuery } from '../GraphQLTest//queries';

//withGraphqlAdd - обгортка в яку першим аргументом перекину створену нами мутацію addUserMutation а другим аргументом передаю обґєкт в якому описую створені нами пропси які підуть в сам компонент і в даному випадку це пропс addUser який буде приймати об'єкт юзера і передавати його свойства в вигляді аргументів в нашу мутацію
//ТОбто завдяки цій обгориці в нашому компоненті появиться пропс addUser - який буде приймати об'єкт в якому мають бути поля name, email, password - після чого ці дані в вигляді аргументів будуть додаватись в нашу мутацію.

const withGraphqlAdd = graphql(addUserMutation, {
  props: ({ mutate }) => ({
    addUser: (user) =>
      mutate({
        variables: user,
        //refetchQueries - обновить дані після отримання fetch даних
        refetchQueries: [{ query: usersQuery }],
      }),
  }),
});

const withGraphqlDelete = graphql(deleteUserMutation, {
  props: ({ mutate }) => ({
    deleteUser: (id) =>
      mutate({
        variables: id,
        //refetchQueries - обновить дані після отримання fetch даних
        refetchQueries: [{ query: usersQuery }],
      }),
  }),
});

const withGraphqlUpdate = graphql(updateUserMutation, {
  props: ({ mutate }) => ({
    updateUser: (updates) =>
      mutate({
        variables: updates,
        //refetchQueries - обновить дані після отримання fetch даних
        refetchQueries: [{ query: usersQuery }],
      }),
  }),
});

const withGraphqlQL = compose(
  graphql(addUserMutation, {
    props: ({ mutate }) => ({
      addUser: (user) =>
        mutate({
          variables: user,
          //refetchQueries - обновить дані після отримання fetch даних
          refetchQueries: [
            {
              query: usersQuery,
              variables: { name: '' },
            },
          ],
        }),
    }),
  }),
  graphql(deleteUserMutation, {
    props: ({ mutate }) => ({
      deleteUser: (id) =>
        mutate({
          variables: id,
          //refetchQueries - обновить дані після отримання fetch даних
          refetchQueries: [
            {
              query: usersQuery,
              variables: { name: '' },
            },
          ],
        }),
    }),
  }),
  graphql(updateUserMutation, {
    props: ({ mutate }) => ({
      updateUser: (updates) =>
        mutate({
          variables: updates,
          //refetchQueries - обновить дані після отримання fetch даних
          refetchQueries: [
            {
              query: usersQuery,
              variables: { name: '' },
            },
          ],
        }),
    }),
  }),
  graphql(filteredUsersQuery, {
    options: ({ name = '' }) => ({
      variables: { name },
    }),
  })
);

export default compose(withGraphqlQL);
