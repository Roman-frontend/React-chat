"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REMOVE_CHANNEL = exports.ADD_MEMBER_CHANNEL = exports.CREATE_CHANNEL = exports.CHANNELS = exports.APP = exports.REMOVE_DIRECT_MESSAGE = exports.CREATE_DIRECT_MESSAGE = exports.GET_DIRECT_MESSAGES = void 0;
const client_1 = require("@apollo/client");
exports.GET_DIRECT_MESSAGES = (0, client_1.gql) `
  query directMessages($id: [ID]) {
    directMessagesId @client @export(as: "id")
    directMessages(id: $id) {
      id
      members
    }
  }
`;
exports.CREATE_DIRECT_MESSAGE = (0, client_1.gql) `
  mutation ($inviter: ID!, $invited: [ID]!) {
    directMessages {
      create(inviter: $inviter, invited: $invited) {
        recordId
        record {
          id
          members
        }
        status
        query {
          users {
            id
          }
        }
        error {
          message
          __typename
          ... on ValidatorError {
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
  }
`;
exports.REMOVE_DIRECT_MESSAGE = (0, client_1.gql) `
  mutation ($id: ID!) {
    directMessages {
      remove(id: $id) {
        recordId
        record {
          id
          members
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
exports.CHANNELS = (0, client_1.gql) `
  query userChannels($channelsId: [ID], $userId: ID!) {
    channels @client @export(as: "channelsId")
    id @client @export(as: "userId")
    userChannels(channelsId: $channelsId, userId: $userId) {
      id
      name
      admin
      members
      isPrivate
    }
  }
`;
exports.CREATE_CHANNEL = (0, client_1.gql) `
  mutation (
    $admin: ID!
    $discription: String
    $isPrivate: Boolean
    $members: [ID]!
    $name: String!
  ) {
    channel {
      create(
        details: {
          admin: $admin
          discription: $discription
          isPrivate: $isPrivate
          name: $name
        }
        members: $members
      ) {
        id
        name
        admin
        members
        isPrivate
      }
    }
  }
`;
exports.ADD_MEMBER_CHANNEL = (0, client_1.gql) `
  mutation ($invited: [ID]!, $chatId: ID!) {
    channel {
      addMember(invited: $invited, chatId: $chatId) {
        id
        members
      }
    }
  }
`;
exports.REMOVE_CHANNEL = (0, client_1.gql) `
  mutation ($channelId: ID!, $userId: ID!) {
    channel {
      remove(channelId: $channelId, userId: $userId) {
        recordId
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
  }
`;
