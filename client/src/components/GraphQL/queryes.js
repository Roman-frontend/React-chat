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
  }
`;

export const CREATE_MESSAGE = gql`
  mutation createMessage(
    $userName: String
    $userId: String
    $text: String
    $replyOn: String
    $chatId: String
    $chatType: String
  ) {
    createMessage(
      userName: $userName
      userId: $userId
      text: $text
      replyOn: $replyOn
      chatId: $chatId
      chatType: $chatType
    ) {
      id
      userName
      userId
      text
      replyOn
      chatId
      chatType
      createdAt
    }
  }
`;

export const UPDATE_MESSAGE = gql`
  mutation changeMessage(
    $id: ID!
    $text: String!
    $chatType: String!
    $createdAt: String
  ) {
    changeMessage(
      id: $id
      text: $text
      chatType: $chatType
      createdAt: $createdAt
    ) {
      id
      userName
      userId
      text
      replyOn
      chatId
      chatType
      createdAt
    }
  }
`;

export const GET_MESSAGES = gql`
  query {
    messages {
      id
      userName
      userId
      text
      replyOn
      chatId
      chatType
      createdAt
    }
  }
`;

export const CHANNELS = gql`
  query userChannels($channelsId: [ID]) {
    channels @client @export(as: "channelsId")
    userChannels(channelsId: $channelsId) {
      id
      name
      creator
      members
      isPrivate
    }
  }
`;

export const CREATE_CHANNEL = gql`
  mutation createChannelMutation(
    $token: String!
    $creator: ID!
    $discription: String
    $isPrivate: Boolean
    $members: [ID]!
    $name: String!
  ) {
    createChannel(
      token: $token
      creator: $creator
      discription: $discription
      isPrivate: $isPrivate
      members: $members
      name: $name
    ) {
      id
      name
      creator
      members
      isPrivate
    }
  }
`;

export const ADD_USER = gql`
  mutation addUserMutation(
    $name: String!
    $email: String!
    $password: String!
  ) {
    addUser(name: $name, email: $email, password: $password) {
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

export const CREATE_DIRECT_MESSAGE = gql`
  mutation createDirectMessage($inviter: ID!, $invited: [ID]!) {
    createDirectMessage(inviter: $inviter, invited: $invited) {
      id
      inviter {
        _id
        name
        email
      }
      invited {
        _id
        name
        email
      }
      createdAt
    }
  }
`;

export const GET_DIRECT_MESSAGES = gql`
  query directMessages($id: [ID]) {
    directMessagesId @client @export(as: "id")
    directMessages(id: $id) {
      id
      inviter {
        _id
        name
        email
      }
      invited {
        _id
        name
        email
      }
      createdAt
    }
  }
`;
