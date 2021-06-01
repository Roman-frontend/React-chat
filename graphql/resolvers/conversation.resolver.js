const ChannelMessage = require('../../models/ChannelMessage');
const DirectMessageChat = require('../../models/DirectMessageChat');
const { checkAccesToChannel, infoError } = require('../helpers');
const { GraphQLScalarType, Kind } = require('graphql');

const resolvers = {
  ChatType: new GraphQLScalarType({
    name: 'ChatType',
    description: 'Сhat type custom scalar type',
    parseValue(value) {
      if (value === 'DirectMessage' || value === 'Channel') return value;
      return null;
    },
    serialize(value) {
      console.log(value, 'ast.value');
      //Коли ми надсилаємо скаляр дати у відповіді GraphQL, ми серіалізуємо його (у відповіді return Я.).
      return value; // value sent to the client
    },
    parseLiteral(ast) {
      console.log(ast.value);
      return ast.value;
    },
  }),
  Query: {
    messages: async (_, { chatId, chatType, userId }, context) => {
      if (!context.isAuth) throw new Error('you must be logged in');
      console.log('geting messages...');
      if (chatType === 'DirectMessage') {
        const chatMessages = await DirectMessageChat.find({ chatId });
        return { id: chatMessages[0].chatId, chatMessages };
      } else if (chatType === 'Channel') {
        const isNotMember = await checkAccesToChannel(chatId, userId);
        if (isNotMember) {
          return;
        }
        const chatMessages = await ChannelMessage.find({ chatId });
        return { id: chatMessages[0].chatId, chatMessages };
      }
    },
  },
  Mutation: {
    message: () => ({}),
  },

  MessageMutations: {
    create: async (_, { text, replyOn, chat }, context) => {
      if (!context.isAuth) throw new Error('you must be logged in');
      console.log('creating message');
      const data = { text, replyOn, ...chat };
      let newMessage;
      if (chat.chatType === 'Channel') {
        console.log(data);
        newMessage = await ChannelMessage.create(data);
      } else if (chat.chatType === 'DirectMessage') {
        newMessage = await DirectMessageChat.create(data);
      }
      console.log(newMessage);
      return newMessage;
    },
    change: async (_, { id, text, chatType }, context) => {
      if (!context.isAuth) throw new Error('you must be logged in');
      console.log('changing message');
      if (chatType === 'Channel') {
        return ChannelMessage.findOneAndUpdate(
          { _id: id },
          { text },
          { useFindAndModify: false, new: true },
          (err) => infoError(err)
        );
      } else if (chatType === 'DirectMessage') {
        return DirectMessageChat.findOneAndUpdate(
          { _id: id },
          { text },
          { useFindAndModify: false, new: true },
          (err) => infoError(err)
        );
      }
    },
    remove: async (_, { id, chatType }, context) => {
      if (!context.isAuth) throw new Error('you must be logged in');
      console.log('removing message');
      if (chatType === 'Channel') {
        await ChannelMessage.findByIdAndRemove(
          { _id: id },
          { useFindAndModify: false, new: true }
        );
      } else if (chatType === 'DirectMessage') {
        await DirectMessageChat.findByIdAndRemove(
          { _id: id },
          { useFindAndModify: false, new: true }
        );
      }
    },
  },
};

module.exports = resolvers;
