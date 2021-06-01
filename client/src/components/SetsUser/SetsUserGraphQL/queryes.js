import { gql } from '@apollo/client';

export const CREATE_DIRECT_MESSAGE = gql`
  mutation ($inviter: ID!, $invited: [ID]!) {
    directMessage {
      create(inviter: $inviter, invited: $invited) {
        id
        members
        createdAt
      }
    }
  }
`;

export const GET_DIRECT_MESSAGES = gql`
  query directMessages($id: [ID]!) {
    directMessagesId @client @export(as: "id")
    directMessages(id: $id) {
      id
      members
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
  query userChannels($channelsId: [ID]!) {
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
  mutation (
    $creator: ID!
    $discription: String
    $isPrivate: Boolean
    $members: [ID]!
    $name: String!
  ) {
    channel {
      create(
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
  }
`;

export const ADD_MEMBER_CHANNEL = gql`
  mutation ($invited: [ID]!, $chatId: ID!) {
    channel {
      addMember(invited: $invited, chatId: $chatId) {
        id
        name
        creator
        members
        isPrivate
      }
    }
  }
`;

export const REMOVE_CHAT = gql`
  mutation ($id: ID!) {
    directMessage {
      remove(id: $id) {
        id
      }
    }
  }
`;

export const REMOVE_CHANNEL = gql`
  mutation ($channelId: ID!, $userId: ID!) {
    channel {
      remove(channelId: $channelId, userId: $userId) {
        id
      }
    }
  }
`;
