"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REMOVE_MESSAGE = exports.CHANGE_MESSAGE = exports.CREATE_MESSAGE = exports.GET_MESSAGES = void 0;
const client_1 = require("@apollo/client");
exports.GET_MESSAGES = (0, client_1.gql) `
  query messages($chatId: ID!, $chatType: ChatType!, $userId: ID!) {
    id @client @export(as: $userId)
    activeChatId @client @export(as: $chatId)
    activeChatType @client @export(as: $chatType)
    messages(chatId: $chatId, chatType: $chatType, userId: $userId) {
      id
      chatMessages {
        id
        senderId
        text
        replyOn
        chatType
        chatId
        createdAt
        updatedAt
      }
    }
  }
`;
exports.CREATE_MESSAGE = (0, client_1.gql) `
  mutation (
    $senderId: ID!
    $text: String!
    $replyOn: String
    $chatId: ID!
    $chatType: ChatType!
  ) {
    message {
      create(
        chat: { senderId: $senderId, chatId: $chatId, chatType: $chatType }
        text: $text
        replyOn: $replyOn
      ) {
        id
        senderId
        text
        replyOn
        chatId
        chatType
        createdAt
        updatedAt
      }
    }
  }
`;
exports.CHANGE_MESSAGE = (0, client_1.gql) `
  mutation ($input: MessageChangeInput!) {
    message {
      change(input: $input) {
        id
        senderId
        text
        replyOn
        chatId
        chatType
        createdAt
        updatedAt
      }
    }
  }
`;
exports.REMOVE_MESSAGE = (0, client_1.gql) `
  mutation ($id: ID!, $chatType: ChatType!) {
    message {
      remove(id: $id, chatType: $chatType) {
        id
      }
    }
  }
`;
