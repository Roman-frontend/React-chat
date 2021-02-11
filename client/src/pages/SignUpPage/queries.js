/* import { gql } from 'apollo-boost';

export const usersQuery = gql`
  query usersQuery {
    users {
      id
      name
      email
    }
  }
`;

export const addUserQuery = gql`
  query addUserQuery($name: String!, $email: String!, $password: String!) {
    addUser(name: $name, email: $email, password: $password) {
      id
      name
      email
      token
    }
  }
`;

export const filteredUsersQuery = gql`
  query filteredUsersQuery($name: String) {
    filteredUsers(name: $name) {
      email
    }
  }
`;
 */
