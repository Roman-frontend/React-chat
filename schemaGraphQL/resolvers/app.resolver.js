const User = require('../../models/User');
const Channel = require('../../models/Channel');
const DirectMessage = require('../../models/DirectMessage');
const DirectMessageChat = require('../../models/DirectMessageChat');
const { infoError } = require('../helpers');

const resolvers = {
  Query: {
    userChannels: async (_, { channelsId }) => {
      if (channelsId) {
        let userChannels = [];
        for (let id of channelsId) {
          const findChannel = await Channel.findById(id);
          console.log(findChannel);
          userChannels = userChannels.concat(findChannel);
        }
        return userChannels;
      } else {
        return Channel.find({});
      }
    },
    users: (_, { id }) => {
      console.log('usersId - ', id);
      if (id) {
        return User.findById(id);
      } else {
        return User.find({});
      }
    },
    directMessages: async (_, { id }) => {
      let allFinded = [];
      for (let directMessageId of id) {
        const finded = await DirectMessage.findById(directMessageId);
        if (finded) {
          allFinded.push({
            id: finded._id,
            inviter: {
              id: finded.inviter._id,
              name: finded.inviter.name,
              email: finded.inviter.email,
            },
            invited: {
              id: finded.invited._id,
              name: finded.invited.name,
              email: finded.invited.email,
            },
            createdAt: finded.createdAt,
          });
        }
      }
      return allFinded;
    },
  },

  Mutation: {
    createChannel: async (_, args) => {
      console.log(args);
      const newChannel = await Channel.create({ ...args });
      for (let memberId of args.members) {
        const user = await User.findById(memberId);
        user.channels.push(newChannel._id);
        await user.save();
      }
      return newChannel;
    },
    addMember: async (_, { token, invited, chatId }) => {
      for await (const invitedId of invited) {
        const addedUser = await User.findById(invitedId);
        addedUser.channels.push(chatId);
        await addedUser.save();

        const activeChannel = await Channel.findById(chatId);
        activeChannel.members.push(invitedId);
        await activeChannel.save();
      }
      return Channel.findById(chatId);
    },

    createDirectMessage: async (_, { inviter, invited }) => {
      let allNew = [];
      for (let invitedId of invited) {
        const dbInviter = await User.findById(inviter);
        const dbInvited = await User.findById(invitedId);
        const newDrMsg = await DirectMessage.create({
          inviter: {
            _id: dbInviter._id,
            name: dbInviter.name,
            email: dbInviter.email,
          },
          invited: {
            _id: dbInvited._id,
            name: dbInvited.name,
            email: dbInvited.email,
          },
        });

        dbInviter.directMessages.push(newDrMsg._id);
        await dbInviter.save();

        dbInvited.directMessages.push(newDrMsg._id);
        await dbInvited.save();

        allNew = allNew.concat({
          id: newDrMsg._id,
          inviter: {
            id: newDrMsg.inviter._id,
            name: newDrMsg.inviter.email,
            email: newDrMsg.inviter.email,
          },
          invited: {
            id: newDrMsg.invited._id,
            name: newDrMsg.invited.name,
            email: newDrMsg.invited.email,
          },
          createdAt: newDrMsg.createdAt,
        });
      }
      return allNew;
    },

    removeDirectMessage: async (_, { id, chatType }) => {
      const removed = await DirectMessage.findByIdAndRemove(
        { _id: id },
        { useFindAndModify: false, new: true }
      );
      const inviter = await User.findById(removed.inviter._id);
      const updaterInvited = inviter.directMessages.filter(
        (drMsg) => drMsg != id
      );
      await User.findOneAndUpdate(
        { _id: removed.inviter._id },
        { directMessages: updaterInvited },
        { useFindAndModify: false, new: true },
        (err) => infoError(err)
      );

      const invited = await User.findById(removed.invited._id);
      const updatedInvited = invited.directMessages.filter(
        (drMsg) => drMsg != id
      );
      await User.findOneAndUpdate(
        { _id: removed.invited._id },
        { directMessages: updatedInvited },
        { useFindAndModify: false, new: true },
        (err) => infoError(err)
      );
      for (;;) {
        const removedMessage = await DirectMessageChat.findOneAndDelete({
          chatId: id,
        });
        if (!removedMessage) {
          break;
        }
      }
      console.log('removed directMessage...');
    },
    removeChannel: async (_, { channelId, userId, token }) => {
      console.log('removing channel -> ');
      const channel = await Channel.findById(channelId);
      const filteredMembers = channel.members.filter((id) => id != userId);
      if (filteredMembers[0]) {
        await Channel.findOneAndUpdate(
          { _id: channelId },
          { members: filteredMembers },
          { useFindAndModify: false, new: true },
          (err) => infoError(err)
        );
      } else {
        await Channel.findByIdAndRemove(
          { _id: channelId },
          { useFindAndModify: false, new: true }
        );
        for (;;) {
          const removedMessage = await ChannelMessage.findOneAndDelete({
            chatId: channelId,
          });
          if (!removedMessage) {
            break;
          }
        }
      }

      const user = await User.findById(userId);
      const filteredChannels = user.channels.filter((id) => id != channelId);
      await User.findOneAndUpdate(
        { _id: userId },
        { channels: filteredChannels },
        { useFindAndModify: false, new: true },
        (err) => infoError(err)
      );
    },
  },
};

module.exports = resolvers;
