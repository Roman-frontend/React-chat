const ChannelMessage = require('../../models/ChannelMessage');
const DirectMessageChat = require('../../models/DirectMessageChat');
const { checkAccesToChannel, infoError } = require('../helpers');

const resolvers = {
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
    createMessage: async (_, args, context) => {
      if (!context.isAuth) throw new Error('you must be logged in');
      console.log('creating message');
      const { chatType } = args;
      let newMessage;
      if (chatType === 'Channel') {
        console.log(args);
        newMessage = await ChannelMessage.create(args);
      } else if (chatType === 'DirectMessage') {
        newMessage = await DirectMessageChat.create(args);
      }
      console.log(newMessage);
      return newMessage;
    },
    changeMessage: async (_, { id, text, chatType }, context) => {
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
    removeMessage: async (_, { id, chatType }, context) => {
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
