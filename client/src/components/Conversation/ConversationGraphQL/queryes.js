import { gql } from '@apollo/client';

export const GET_MESSAGES = gql`
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

export const CREATE_MESSAGE = gql`
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

export const CHANGE_MESSAGE = gql`
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

export const REMOVE_MESSAGE = gql`
  mutation ($id: ID!, $chatType: ChatType!) {
    message {
      remove(id: $id, chatType: $chatType) {
        id
      }
    }
  }
`;
