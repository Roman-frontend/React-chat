const ChannelService = require("../../Service/ChannelService.js");

const resolvers = {
  Query: {
    userChannels: async (_, args, context) => {
      if (!context.isAuth) throw new Error("you must be logged in");
      const channels = await ChannelService.getChannels(args);
      return channels;
    },
  },

  Mutation: {
    channel: () => ({}),
  },

  ChannelMutations: {
    create: async (_, args, context) => {
      if (!context.isAuth) throw new Error("you must be logged in");
      const channel = await ChannelService.createChannel(args);
      return channel;
    },
    addMember: async (_, args, context) => {
      if (!context.isAuth) throw new Error("you must be logged in");
      const updatedChannel = ChannelService.addMemberToChannel(args);
      return updatedChannel;
    },

    remove: async (_, args, context) => {
      if (!context.isAuth) throw new Error("you must be logged in");
      const { status, channelId } = await ChannelService.removeChannel(args);
      if (status === 200) {
        return {
          recordId: channelId,
          status: 200,
          query: {},
          error: {
            message: "Succes remove channel",
            value: "Succes",
            code: 200,
          },
        };
      }
    },
  },
};

module.exports = resolvers;
