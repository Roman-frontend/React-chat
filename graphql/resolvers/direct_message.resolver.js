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
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SOME_INVITED: 419,
    ALL_INVITED: 420,
    //Сервер зіткнувся з несподіваною умовою, яка перешкодила йому виконати запит. - 500
    INTERNAL_SERVER_ERROR: 500,
  },

  ErrorInterface: {
    __resolveType(obj, context, info) {
      if (obj.code === 401) {
        return 'AuthError';
      }

      if (obj.code === 500) {
        return 'ValidatorError';
      }

      if (obj.code === 200) {
        return 'ValidatorError';
      }

      if (obj.code === 400) {
        return 'ValidatorError';
      }

      if (obj.code === 403) {
        return 'ValidatorError';
      }

      return null;
    },
  },

  Query: {
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
      return allFinded;
    },
  },

  Mutation: {
    directMessages: () => ({}),
  },

  DirectMessagesMutations: {
    create: async (_, { inviter, invited }, context) => {
      if (!context.isAuth) {
        return {
          status: 401,
          query: {},
          error: {
            message: 'you must be logged in',
            value: 'unauthorized',
            code: 401,
          },
        };
      }
      let allNew = [];
      let alreadyInviteds = [];
      for (let invitedId of invited) {
        const sortedMembers = [inviter, invitedId].sort();
        const userHasChat = await DirectMessage.exists({
          members: sortedMembers,
        });
        if (userHasChat || inviter === invitedId) {
          const alreadyInvited = await User.findById(invitedId);
          alreadyInviteds.push(alreadyInvited.email);
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
      const errorMessage = alreadyInviteds[1]
        ? `Users ${alreadyInviteds.join(', ')} already invited`
        : alreadyInviteds[0]
        ? `User ${alreadyInviteds.join(', ')} already invited`
        : 'This is a success invite!';
      const allNewId = allNew.map((drMsg) => drMsg.id);
      const status =
        alreadyInviteds.length === invited.length
          ? 420
          : alreadyInviteds[0]
          ? 419
          : 200;
      return {
        recordId: allNewId,
        record: allNew,
        status,
        query: {},
        error: {
          message: errorMessage,
          value: 'validation error',
          code: 500,
        },
      };
    },
    remove: async (_, { id }, context) => {
      if (!context.isAuth) {
        return {
          status: 401,
          query: {},
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
      console.log('removed dm: ', removed);
      return {
        recordId: id,
        record: { id, members: removed.members },
        status: 200,
        query: {},
        error: {
          message: 'Succes remove',
          value: 'validation error',
          code: 500,
        },
      };
    },
  },
};

module.exports = resolvers;
