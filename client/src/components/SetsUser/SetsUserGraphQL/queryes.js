import { gql } from '@apollo/client';

export const CREATE_DIRECT_MESSAGE = gql`
  mutation createDirectMessage($inviter: ID!, $invited: [ID]!) {
    createDirectMessage(inviter: $inviter, invited: $invited) {
      id
      inviter {
        id
        name
        email
      }
      invited {
        id
        name
        email
      }
      createdAt
    }
  }
`;

export const GET_DIRECT_MESSAGES = gql`
  query directMessages($id: [ID]!) {
    directMessagesId @client @export(as: "id")
    directMessages(id: $id) {
      id
      inviter {
        id
        name
        email
      }
      invited {
        id
        name
        email
      }
      createdAt
    }
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

export const ADD_MEMBER_CHANNEL = gql`
  mutation addMember($token: String!, $invited: [ID]!, $chatId: ID!) {
    addMember(token: $token, invited: $invited, chatId: $chatId) {
      id
      name
      creator
      members
      isPrivate
    }
  }
`;

export const REMOVE_CHAT = gql`
  mutation removeDirectMessage($id: ID!, $chatType: String!) {
    removeDirectMessage(id: $id, chatType: $chatType) {
      id
    }
  }
`;

export const REMOVE_CHANNEL = gql`
  mutation removeChannel($channelId: ID!, $userId: ID!, $token: String!) {
    removeChannel(channelId: $channelId, userId: $userId, token: $token) {
      id
    }
  }
`;
