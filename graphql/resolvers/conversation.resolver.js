const { GraphQLScalarType } = require("graphql");
const ConversationService = require("../../Service/ConversationService");

const resolvers = {
  ChatType: new GraphQLScalarType({
    name: "ChatType",
    description: "Сhat type custom scalar type",
    parseValue(value) {
      if (value === "DirectMessage" || value === "Channel") return value;
      return null;
    },
    serialize(value) {
      //Коли ми надсилаємо скаляр дати у відповіді GraphQL, ми серіалізуємо його (у відповіді return Я.).
      return value; // value sent to the client
    },
    parseLiteral(ast) {
      return ast.value;
    },
  }),
  Query: {
    messages: async (_, { chatId, chatType, userId }, context) => {
      if (!context.isAuth) {
        throw new Error("you must be logged in");
      }
      if (chatType === "DirectMessage") {
        return await ConversationService.getMessagesFromDM(chatId);
      } else if (chatType === "Channel") {
        return await ConversationService.getMessagesFromChannel({
          chatId,
          userId,
        });
      }
    },
  },
  Mutation: {
    message: () => ({}),
  },

  MessageMutations: {
    create: async (_, { text, replyOn, replySenderId, chat }, context) => {
      if (!context.isAuth) {
        throw new Error("you must be logged in");
      }
      const data = { text, replyOn, replySenderId, ...chat };
      let newMessage;
      if (chat.chatType === "Channel") {
        return await ConversationService.createMessageInChannel(data);
      } else if (chat.chatType === "DirectMessage") {
        return await ConversationService.createMessageInDM(data);
      }
      return newMessage;
    },
    change: async (_, { input }, context) => {
      const { id, text, chatType } = { ...input };
      if (!context.isAuth) {
        throw new Error("you must be logged in");
      }
      if (chatType === "Channel") {
        return ConversationService.changeMessageInChannel({ id, text });
      } else if (chatType === "DirectMessage") {
        return ConversationService.changeMessageInDM({ id, text });
      }
    },
    remove: async (_, { id, chatType }, context) => {
      if (!context.isAuth) {
        throw new Error("you must be logged in");
      }
      if (chatType === "Channel") {
        await ConversationService.removeMessageInChannel(id);
      } else if (chatType === "DirectMessage") {
        await ConversationService.removeMessageInDM(id);
      }
    },
  },
};

module.exports = resolvers;
