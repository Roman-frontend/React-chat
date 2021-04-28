import { gql } from '@apollo/client';

export const CREATE_MESSAGE = gql`
  mutation createMessage(
    $userName: String
    $userId: ID
    $text: String
    $replyOn: String
    $chatId: ID
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

export const CHANGE_MESSAGE = gql`
  mutation changeMessage($id: ID!, $text: String!, $chatType: String!) {
    changeMessage(id: $id, text: $text, chatType: $chatType) {
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

export const REMOVE_MESSAGE = gql`
  mutation removeMessage($id: ID!, $chatType: String!) {
    removeMessage(id: $id, chatType: $chatType) {
      id
    }
  }
`;

export const GET_MESSAGES = gql`
  query messages($chatId: ID!, $chatType: String!, $userId: ID!) {
    id @client @export(as: $userId)
    activeChatId @client @export(as: $chatId)
    activeChatType @client @export(as: $chatType)
    messages(chatId: $chatId, chatType: $chatType, userId: $userId) {
      id
      chatMessages {
        id
        userName
        userId
        text
        replyOn
        createdAt
        chatType
        chatId
      }
    }
  }
`;
