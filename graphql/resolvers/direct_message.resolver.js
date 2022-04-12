const { GraphQLEnumType } = require("graphql");
require("dotenv").config();
const DMService = require("../../Service/DMService");

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
        return "AuthError";
      }

      if (obj.code === 500) {
        return "ValidatorError";
      }

      if (obj.code === 200) {
        return "ValidatorError";
      }

      if (obj.code === 400) {
        return "ValidatorError";
      }

      if (obj.code === 403) {
        return "ValidatorError";
      }

      return null;
    },
  },

  Query: {
    directMessages: async (_, args, context) => {
      if (!context.isAuth) throw new Error("you must be logged in");
      const { status, directMessages } = await DMService.getDirectMessages(
        args
      );
      if (status === 200) return directMessages;
    },
    sendToGmail: (_, args, context) => {
      if (!context.isAuth) throw new Error("you must be logged in");

      const { status, message } = DMService.sendToGmail(args);
      if (status === 200) return { status, message };
      if (status === 500) return { status, message };
    },
  },

  Mutation: {
    directMessages: () => ({}),
  },

  DirectMessagesMutations: {
    create: async (_, args, context) => {
      if (!context.isAuth) {
        return {
          status: 401,
          query: {},
          error: {
            message: "you must be logged in",
            value: "unauthorized",
            code: 401,
          },
        };
      }

      const { status, directMessagesId, directMessages, message } =
        await DMService.createDM(args);
      const statusValue =
        status === 420 ? "ALL_INVITED" : status === 419 ? "SOME_INVITED" : "OK";

      return {
        recordId: directMessagesId,
        record: directMessages,
        status,
        query: {},
        error: { message, value: statusValue, code: 200 },
      };
    },
    remove: async (_, args, context) => {
      if (!context.isAuth) {
        return {
          status: 401,
          query: {},
          error: {
            message: "you must be logged in",
            value: "unauthorized",
            code: 401,
          },
        };
      }

      const { status, id, members } = await DMService.removeDM(args);
      return {
        recordId: id,
        record: { id, members },
        status,
        query: {},
        error: { message: "Succes remove", value: "Success", code: 200 },
      };
    },
  },
};

module.exports = resolvers;
