const { GraphQLEnumType } = require('graphql');
const User = require('../../models/User');
const DirectMessage = require('../../models/DirectMessage');
const DirectMessageChat = require('../../models/DirectMessageChat');
const { infoError } = require('../helpers');

const resolvers = {
  StatusEnum: {
    OK: 200,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  },

  ErrorInterface: {
    __resolveType(obj, context, info) {
      if (obj.code === 401) {
        return 'AuthError';
      }

      return null;
    },
  },

  Query: {
    directMessages: async (_, { id }, context) => {
      console.log('get direct messages -- ');
      if (!context.isAuth) throw new Error('you must be logged in');
      let allFinded = [];
      //Можна створити валідатор який перевіряє чи це юзер має доступ до цих повідомлень ждя цього сюди треба передати ід юзера, знайти його модель в ДБ і через інклудес перевірити і якщо перевірку проходить то тоді продовжити.
      for (let directMessageId of id) {
        const finded = await DirectMessage.findById(directMessageId);
        if (finded) {
          allFinded.push(finded);
        }
      }
      return allFinded;
    },
  },

  Mutation: {
    directMessages: () => ({}),
  },

  DirectMessagesMutations: {
    remove: async (_, { id }, context) => {
      console.log('remove direct message');
      if (context.isAuth) {
        return {
          error: {
            message: 'you must be logged in',
            value: 'unauthorized',
            code: 401,
          },
        };
      }
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
      return {
        recordId: id,
        status: 200,
        query: {},
        error: { path: true },
      };
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
      return allNew;
    },
  },
};

module.exports = resolvers;
