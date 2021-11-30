const User = require('../../models/User');
const Channel = require('../../models/Channel');
const ChannelMessage = require('../../models/ChannelMessage');

const resolvers = {
  Query: {
    userChannels: async (_, { channelsId, userId }, context) => {
      if (!context.isAuth) throw new Error('you must be logged in');
      if (channelsId) {
        let userChannels = [];
        for (let id of channelsId) {
          const findChannel = await Channel.findById(id);
          if (findChannel) {
            const userIsMember = findChannel.members.includes(userId);
            if (userIsMember) {
              userChannels = userChannels.concat(findChannel);
            }
          }
        }
        return userChannels;
      }
      return [];
    },
  },

  Mutation: {
    channel: () => ({}),
  },

  ChannelMutations: {
    create: async (_, { members, details }, context) => {
      if (!context.isAuth) throw new Error('you must be logged in');
      const newChannel = await Channel.create({ members, ...details });
      for (let memberId of members) {
        const user = await User.findById(memberId);
        user.channels.push(newChannel._id);
        await user.save();
      }
      return newChannel;
    },
    addMember: async (_, { invited, chatId }, context) => {
      if (!context.isAuth) throw new Error('you must be logged in');
      for await (const invitedId of invited) {
        const addedUser = await User.findById(invitedId);
        const isIncludesChannel = addedUser.channels.includes(chatId);
        if (!isIncludesChannel) {
          addedUser.channels.push(chatId);
          await addedUser.save();
        }

        const activeChannel = await Channel.findById(chatId);
        const isIncludesMember = activeChannel.members.includes(invited);
        if (!isIncludesMember) {
          activeChannel.members.push(invitedId);
          await activeChannel.save();
        }
      }
      return Channel.findById(chatId);
    },

    remove: async (_, { channelId, userId }, context) => {
      if (!context.isAuth) throw new Error('you must be logged in');
      const channel = await Channel.findById(channelId);
      const filteredMembers = channel.members.filter((id) => id != userId);
      if (channel.admin === userId || !filteredMembers[0]) {
        await Channel.findByIdAndRemove(
          { _id: channelId },
          { useFindAndModify: false, new: true }
        );
        await ChannelMessage.deleteMany({ chatId: channelId });
      }
      if (filteredMembers[0]) {
        await Channel.findOneAndUpdate(
          { _id: channelId },
          { members: filteredMembers },
          { useFindAndModify: false, new: true }
        );
      }

      const user = await User.findById(userId);
      const filteredChannels = user.channels.filter((id) => id != channelId);
      await User.findOneAndUpdate(
        { _id: userId },
        { channels: filteredChannels },
        { useFindAndModify: false, new: true }
      );

      return {
        recordId: channelId,
        status: 200,
        query: {},
        error: {
          message: 'Succes remove channel',
          value: 'validation error',
          code: 500,
        },
      };
    },
  },
};

module.exports = resolvers;
