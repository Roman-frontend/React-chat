const { GraphQLScalarType, Kind, GraphQLError } = require("graphql");
const AuthService = require("../../Service/AuthService.js");
//const { Kind } = require('graphql/language');

const resolvers = {
  Email: new GraphQLScalarType({
    name: "Email",
    description: "A string which represents a email for auth",
    //--- ОПРЕДЕЛЯЕМ КАК ТИП ПРИНИМАТЬ ОТ КЛИЕНТА ---
    // Чтобы принять значение от клиента, провалидировать его и преобразовать
    // в нужный тип/объект для работы на сервере вам нужно определить две функции: parseValue, parseLiteral

    // `parseValue`, используется если клиент передал значение через GraphQL-переменную:
    // {
    //   variableValues: { "date": 1536417553 }
    //   source: `query ($date: DateTimestamp) { setDate(date: $date) }`
    // }
    parseValue(value) {
      const regExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

      if (value.match(regExp)) return value;
      throw new GraphQLError(`Incorrect email: ${value}`);
    },
    //--- ОПРЕДЕЛЯЕМ КАК ТИП ОТДАВАТЬ КЛИЕНТУ ---
    serialize(value) {
      //Коли ми надсилаємо скаляр дати у відповіді GraphQL, ми серіалізуємо його (у відповіді return Я.).
      return value; // value sent to the client
    },
    // `parseLiteral`, используется если клиент передал значение в теле GraphQL-запроса:
    // { source: `query { setDate(date: 1536417553) }` }
    parseLiteral(ast) {
      return ast.value;
    },
  }),
  AuthName: new GraphQLScalarType({
    name: "AuthName",
    description: "A string which represents a name for auth",
    parseValue(value) {
      const regExp = /^([A-Za-z0-9]){3,15}$/gi;
      if (value.match(regExp)) return value;

      throw new GraphQLError(`Incorrect name: ${value}`);
    },
    serialize(value) {
      return value; // value sent to the client
    },
    parseLiteral(ast) {
      return ast.value;
    },
  }),
  AuthPassword: new GraphQLScalarType({
    name: "AuthPassword",
    description: "A string which represents a password for auth",
    parseValue(value) {
      if (value.length >= 8 && value.length <= 15) return value;

      throw new GraphQLError(`Incorrect password: ${value}`);
    },
    serialize(value) {
      return value; // value sent to the client
    },
    parseLiteral(ast) {
      return ast.value;
    },
  }),
  Query: {
    login: async (_, args) => {
      const { status, error, user, token } = await AuthService.getUser(args);

      if (status === 400) {
        return {
          status: 400,
          query: {},
          error: {
            message: `Помилочка : ${error}`,
            value: "BAD_REQUEST",
            code: 400,
          },
        };
      }

      if (status === 401) {
        return {
          status: 401,
          query: {},
          error: {
            message: `email or password is not correct`,
            value: "unauthorized",
            code: 401,
          },
        };
      }

      if (status === 500) {
        return {
          status: 500,
          query: {},
          error: {
            message: `email or password is not correct`,
            value: "Internal Error",
            code: 500,
          },
        };
      }

      return {
        record: {
          id: user.id,
          name: user.name,
          email: user.email,
          channels: user.channels,
          directMessages: user.directMessages,
          token,
        },
        status: 200,
        query: {},
      };
    },
  },

  Mutation: {
    register: async (_, args) => {
      const { status, error, user, token } = await AuthService.registerUser(
        args
      );
      const { id, name, email, channels, directMessages } = user;

      if (status === 400) {
        return {
          status: 400,
          query: {},
          error: {
            message: `Помилочка : ${error}`,
            value: "BAD_REQUEST",
          },
        };
      }
      if (status === 403) {
        return {
          status: 403,
          query: {},
          error: {
            message: `incorrect data entered`,
            value: "FORBIDDEN",
            code: 403,
          },
        };
      }

      return {
        recordId: id,
        record: { id, name, email, channels, directMessages, token },
        status: 200,
        query: {},
        error: {
          message: "Succes register",
          value: "OK",
          code: 200,
        },
      };
    },
  },
};

module.exports = resolvers;
