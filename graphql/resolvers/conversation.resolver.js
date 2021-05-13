const ChannelMessage = require('../../models/ChannelMessage');
const DirectMessageChat = require('../../models/DirectMessageChat');
const { checkAccesToChannel, infoError } = require('../helpers');

const resolvers = {
  Query: {
    messages: async (_, { chatId, chatType, userId }) => {
      console.log('geting messages...', chatId, chatType);
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
    createMessage: async (_, { message }) => {
      console.log('creating message', message);
      const { chatType } = message;
      let newMessage;
      if (chatType === 'Channel') {
        console.log('message', message);
        newMessage = await ChannelMessage.create(message);
      } else if (chatType === 'DirectMessage') {
        newMessage = await DirectMessageChat.create(message);
      }
      console.log('newMessage', newMessage);
      return newMessage;
    },
    changeMessage: async (_, { id, text, chatType }) => {
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
    removeMessage: async (_, { id, chatType }) => {
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
