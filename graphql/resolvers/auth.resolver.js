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
      console.log('value - ', value);
      const regExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

      if (value.match(regExp)) return value;
      console.log('ast.value', value + 'aa');
      throw new GraphQLError(`Incorrect email: ${value}`);
    },
    //--- ОПРЕДЕЛЯЕМ КАК ТИП ОТДАВАТЬ КЛИЕНТУ ---
    serialize(value) {
      console.log(value, 'ast.value');
      //Коли ми надсилаємо скаляр дати у відповіді GraphQL, ми серіалізуємо його (у відповіді return Я.).
      return value; // value sent to the client
    },
    // `parseLiteral`, используется если клиент передал значение в теле GraphQL-запроса:
    // { source: `query { setDate(date: 1536417553) }` }
    parseLiteral(ast) {
      console.log(ast.value);
      return ast.value;
    },
  }),
  AuthName: new GraphQLScalarType({
    name: 'AuthName',
    description: 'A string which represents a name for auth',
    parseValue(value) {
      console.log('AuthName - ', value);
      const regExp = /^([A-Za-z0-9]){3,15}$/gi;
      if (value.match(regExp)) return value;

      throw new GraphQLError(`Incorrect name: ${value}`);
    },
    serialize(value) {
      console.log('name', value);
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
      console.log('AuthPassword - ', value);
      if (value.length >= 8 && value.length <= 15) return value;
      console.log('error in AuthPassword');

      throw new GraphQLError(`Incorrect password: ${value}`);
    },
    serialize(value) {
      console.log('password', value);
      return value; // value sent to the client
    },
    parseLiteral(ast) {
      console.log('parseLiteral password', ast.value);
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
        throw new Error(`Couldn't find email: ${email}`);
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error('Невірний пароль, спробуйте знову');
      }
      const token = jwt.sign(
        { userId: user.id },
        config.get('jwtSecret')
        //{ expiresIn: '1h'}
      );
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        channels: user.channels,
        directMessages: user.directMessages,
        token,
      };
    },
  },

  Mutation: {
    register: async (_, args) => {
      try {
        await schema.validate(args, { abortEarly: false });
      } catch (err) {
        throw new Error(`Error : ${formatYupError(err)}`);
      }
      const { name, email, password } = args;

      const emailIsBasy = await User.findOne({ email });
      if (emailIsBasy) {
        throw new Error(`Email: ${email} is basy`);
      }
      const hashPassword = await bcrypt.hash(password, 12);
      /* const newUser = await User.create({
        name,
        email,
        password: hashPassword,
      }); */
      const newUser = await User.findOne({ email: 'r@mail.ru' });
      const token = jwt.sign(
        { userId: newUser.id },
        config.get('jwtSecret')
        //{ expiresIn: '1h'}
      );
      return {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        channels: newUser.channels,
        directMessages: newUser.directMessages,
        token,
      };
    },
  },
};

module.exports = resolvers;
