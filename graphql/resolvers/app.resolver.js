const User = require('../../models/User');
const Channel = require('../../models/Channel');
const DirectMessage = require('../../models/DirectMessage');
const DirectMessageChat = require('../../models/DirectMessageChat');
const ChannelMessage = require('../../models/ChannelMessage');
const { infoError } = require('../helpers');

const resolvers = {
  Query: {
    userChannels: async (_, { channelsId }, context) => {
      console.log('get userChannels');
      if (!context.isAuth) throw new Error('you must be logged in');
      if (channelsId) {
        let userChannels = [];
        for (let id of channelsId) {
          const findChannel = await Channel.findById(id);
          userChannels = userChannels.concat(findChannel);
        }
        console.log(userChannels);
        return userChannels;
      }
      console.log('empty userChannels');
      return [];
    },
    users: (_, { id }, context) => {
      if (!context.isAuth) throw new Error('you must be logged in');
      if (id) {
        return User.findById(id);
      } else {
        return User.find({});
      }
    },
    directMessages: async (_, { id }, context) => {
      if (!context.isAuth) throw new Error('you must be logged in');
      let allFinded = [];
      //Можна створити валідатор який перевіряє чи це юзер має доступ до цих повідомлень ждя цього сюди треба передати ід юзера, знайти його модель в ДБ і через інклудес перевірити і якщо перевірку проходить то тоді продовжити.
      for (let directMessageId of id) {
        const finded = await DirectMessage.findById(directMessageId);
        if (finded) {
          allFinded.push(finded);
        }
      }
      //console.log('allFinded', allFinded);
      return allFinded;
    },
  },

  Mutation: {
    directMessage: () => ({}),
    channel: () => ({}),
  },

  DirectMessagesMutations: {
    remove: async (_, { id }, context) => {
      if (!context.isAuth) throw new Error('you must be logged in');
      const removed = await DirectMessage.findByIdAndRemove(
        { _id: id },
        { useFindAndModify: false, new: true }
      );
      const inviter = await User.findById(removed.members[0]);
      const updaterInvited = inviter.directMessages.filter(
        (drMsg) => drMsg != id
      );
      await User.findOneAndUpdate(
        { _id: removed.members[0] },
        { directMessages: updaterInvited },
        { useFindAndModify: false, new: true },
        (err) => infoError(err)
      );

      const invited = await User.findById(removed.members[1]);
      const updatedInvited = invited.directMessages.filter(
        (drMsg) => drMsg != id
      );
      await User.findOneAndUpdate(
        { _id: removed.members[1] },
        { directMessages: updatedInvited },
        { useFindAndModify: false, new: true },
        (err) => infoError(err)
      );
      await DirectMessageChat.deleteMany({ chatId: id });
    },

    create: async (_, { inviter, invited }, context) => {
      if (!context.isAuth) throw new Error('you must be logged in');
      let allNew = [];
      for (let invitedId of invited) {
        const sortedMembers = [inviter, invitedId].sort();
        const userHasChat = await DirectMessage.exists({
          members: sortedMembers,
        });
        if (userHasChat || inviter === invitedId) {
          console.log('userHasChat');
          continue;
        }
        const dbInviter = await User.findById(inviter);
        const dbInvited = await User.findById(invitedId);
        const newDrMsg = await DirectMessage.create({ members: sortedMembers });

        dbInviter.directMessages.push(newDrMsg.id);
        await dbInviter.save();

        dbInvited.directMessages.push(newDrMsg.id);
        await dbInvited.save();

        allNew = allNew.concat(newDrMsg);
      }
      console.log(allNew);
      return allNew;
    },
  },

  ChannelMutations: {
    create: async (_, args, context) => {
      if (!context.isAuth) throw new Error('you must be logged in');
      const newChannel = await Channel.create({ ...args });
      for (let memberId of args.members) {
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
      if (channel.creator === userId || !filteredMembers[0]) {
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
    },
  },
};

module.exports = resolvers;
