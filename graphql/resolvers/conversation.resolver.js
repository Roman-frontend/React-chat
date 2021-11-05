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
      //Коли ми надсилаємо скаляр дати у відповіді GraphQL, ми серіалізуємо його (у відповіді return Я.).
      return value; // value sent to the client
    },
    parseLiteral(ast) {
      return ast.value;
    },
  }),
  Query: {
    messages: async (_, { chatId, chatType, userId }, context) => {
      console.log('get messages with datas: ', chatId, chatType, userId);
      if (!context.isAuth) throw new Error('you must be logged in');
      console.log('chatId``````````', chatId);
      if (chatType === 'DirectMessage') {
        const chatMessages = await DirectMessageChat.find({ chatId });
        console.log('direct messages chatMessages______', chatMessages);
        return { id: chatId, chatMessages };
      } else if (chatType === 'Channel') {
        const isNotMember = await checkAccesToChannel(chatId, userId);
        if (isNotMember) {
          return;
        }
        const chatMessages = await ChannelMessage.find({ chatId });
        console.log('channel chatMessages______', chatMessages);
        return { id: chatId, chatMessages };
      }
    },
  },
  Mutation: {
    message: () => ({}),
  },

  MessageMutations: {
    create: async (_, { text, replyOn, chat }, context) => {
      if (!context.isAuth) throw new Error('you must be logged in');
      const data = { text, replyOn, ...chat };
      let newMessage;
      if (chat.chatType === 'Channel') {
        newMessage = await ChannelMessage.create(data);
      } else if (chat.chatType === 'DirectMessage') {
        newMessage = await DirectMessageChat.create(data);
      }
      console.log('newMessage +++++', newMessage);
      return newMessage;
    },
    change: async (_, { input }, context) => {
      const { id, text, chatType } = { ...input };
      if (!context.isAuth) throw new Error('you must be logged in');
      if (chatType === 'Channel') {
        return ChannelMessage.findOneAndUpdate(
          { _id: id },
          { text: text },
          { useFindAndModify: false, new: true },
          (err) => infoError(err)
        );
      } else if (chatType === 'DirectMessage') {
        return DirectMessageChat.findOneAndUpdate(
          { _id: id },
          { text: text },
          { useFindAndModify: false, new: true },
          (err) => infoError(err)
        );
      }
    },
    remove: async (_, { id, chatType }, context) => {
      if (!context.isAuth) throw new Error('you must be logged in');
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
