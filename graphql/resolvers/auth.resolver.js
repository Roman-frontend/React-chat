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

const schema = yup.object().shape({
  name: yup.string().min(3, nameNotLongEnough).max(255),
  email: yup.string().min(3, emailNotLongEnough).max(255).email(invalidEmail),
  password: yup.string().min(3, passwordNotLongEnough).max(255),
});

const resolvers = {
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
      const newUser = await User.create({
        name,
        email,
        password: hashPassword,
      });
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
