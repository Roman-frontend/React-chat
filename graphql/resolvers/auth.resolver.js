const bcrypt = require('bcryptjs');
const User = require('../../models/User.js');
const jwt = require('jsonwebtoken');
const yup = require('yup');
const config = require('config');
const {
  nameNotLongEnough,
  emailNotLongEnough,
  invalidEmail,
  passwordNotLongEnough,
} = require('../../common/errors');
const { formatYupError } = require('../helpers');
const { GraphQLScalarType, Kind, GraphQLError } = require('graphql');
//const { Kind } = require('graphql/language');

const schema = yup.object().shape({
  name: yup.string().min(3, nameNotLongEnough).max(255),
  email: yup.string().min(3, emailNotLongEnough).max(255).email(invalidEmail),
  password: yup.string().min(3, passwordNotLongEnough).max(255),
});

const resolvers = {
  Email: new GraphQLScalarType({
    name: 'Email',
    description: 'A string which represents a email for auth',
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
    name: 'AuthName',
    description: 'A string which represents a name for auth',
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
    name: 'AuthPassword',
    description: 'A string which represents a password for auth',
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
      try {
        await schema.validate(args, { abortEarly: false });
      } catch {
        return formatYupError(err);
      }
      const { email, password } = args;
      const user = await User.findOne({ email });
      if (!user) {
        return {
          status: 401,
          query: {},
          error: {
            message: `email or password is not correct`,
            value: 'unauthorized',
            code: 401,
          },
        };
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return {
          status: 500,
          query: {},
          error: {
            message: `email or password is not correct`,
            value: 'Internal Error',
            code: 500,
          },
        };
      }
      const token = jwt.sign(
        { userId: user.id },
        config.get('jwtSecret')
        //{ expiresIn: '1h'}
      );
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
        error: {
          message: `email or password is not correct`,
          value: 'unauthorized',
          code: 401,
        },
      };
    },
  },

  Mutation: {
    register: async (_, args) => {
      console.log('registration');
      try {
        await schema.validate(args, { abortEarly: false });
      } catch (err) {
        return {
          status: 400,
          query: {},
          error: {
            message: `Помилочка : ${formatYupError(err)}`,
            value: 'BAD_REQUEST',
          },
        };
      }
      const { name, email, password } = args;

      const emailIsBasy = await User.findOne({ email });
      if (emailIsBasy) {
        console.log('incorect register datas');
        return {
          status: 403,
          query: {},
          error: {
            message: `incorrect data entered`,
            value: 'FORBIDDEN',
            code: 403,
          },
        };
      }
      const hashPassword = await bcrypt.hash(password, 12);
      const newUser = await User.create({
        name,
        email,
        password: hashPassword,
      });
      //const newUser = await User.findOne({ email: 'r@mail.ru' });
      const token = jwt.sign(
        { userId: newUser.id },
        config.get('jwtSecret')
        //{ expiresIn: '1h'}
      );
      return {
        recordId: newUser.id,
        record: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          channels: newUser.channels,
          directMessages: newUser.directMessages,
          token,
        },
        status: 200,
        query: {},
        error: {
          message: 'Succes register',
          value: 'unauthorized',
          code: 401,
        },
      };
    },
  },
};

module.exports = resolvers;
