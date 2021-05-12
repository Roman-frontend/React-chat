import { gql } from '@apollo/client';

export const LOGIN = gql`
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

export const AUTH = gql`
  query {
    token @client
    name @client
    email @client
    id @client
    channels @client
    directMessagesId @client
  }
`;

export const APP = gql`
  {
    usersOnline @client
    activeChannelId @client
    activeDirectMessageId @client
    activeChatId @client
    activeChatType @client
  }
`;

export const REGISTER = gql`
  mutation registerMutation(
    $name: String!
    $email: String!
    $password: String!
  ) {
    register(name: $name, email: $email, password: $password) {
      id
      name
      email
      channels
      directMessages
      token
    }
  }
`;

//userId @client - так позначаю параметр який запитую на клієнт, без пошуку на сервері.
export const GET_USERS = gql`
  query users($id: ID) {
    users(id: $id) {
      id
      name
      email
    }
  }
`;
