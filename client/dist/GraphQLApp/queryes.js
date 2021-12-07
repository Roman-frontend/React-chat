"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET_USERS = exports.REGISTER = exports.APP = exports.AUTH = exports.LOGIN = void 0;
const client_1 = require("@apollo/client");
exports.LOGIN = (0, client_1.gql) `
  query Login($email: Email!, $password: AuthPassword!) {
    login(email: $email, password: $password) {
      record {
        id
        name
        email
        channels
        directMessages
        token
      }
      status
      error {
        message
        __typename # <--- Client will receive error type name
        ... on ValidatorError {
          # <--- Request additional fields according to error type
          path
          value
        }
        ... on MongoError {
          code
        }
        ... on AuthError {
          value
          code
        }
      }
    }
  }
`;
exports.AUTH = (0, client_1.gql) `
  query {
    token @client
    name @client
    email @client
    id @client
    channels @client
    directMessagesId @client
  }
`;
exports.APP = (0, client_1.gql) `
  {
    usersOnline @client
    activeChannelId @client
    activeDirectMessageId @client
    activeChatId @client
    activeChatType @client
  }
`;
exports.REGISTER = (0, client_1.gql) `
  mutation Register(
    $name: AuthName!
    $email: Email!
    $password: AuthPassword!
  ) {
    register(name: $name, email: $email, password: $password) {
      recordId
      record {
        id
        name
        email
        channels
        directMessages
        token
      }
      status
      error {
        message
        __typename # <--- Client will receive error type name
        ... on ValidatorError {
          # <--- Request additional fields according to error type
          path
          value
        }
        ... on MongoError {
          code
        }
        ... on AuthError {
          value
          code
        }
      }
    }
  }
`;
//userId @client - так позначаю параметр який запитую на клієнт, без пошуку на сервері.
exports.GET_USERS = (0, client_1.gql) `
  query users($id: ID) {
    users(id: $id) {
      id
      name
      email
    }
  }
`;
