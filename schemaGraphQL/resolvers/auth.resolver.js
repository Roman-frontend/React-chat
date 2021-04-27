const bcrypt = require('bcryptjs');
const User = require('../../models/User.js');
const jwt = require('jsonwebtoken');
const yup = require('yup');
const config = require('config');
const {
  formatYupError,
  nameNotLongEnough,
  emailNotLongEnough,
  invalidEmail,
  passwordNotLongEnough,
} = require('../helpers');

const schema = yup.object().shape({
  name: yup.string().min(3, nameNotLongEnough).max(255),
  email: yup.string().min(3, emailNotLongEnough).max(255).email(invalidEmail),
  password: yup.string().min(3, passwordNotLongEnough).max(255),
});

const resolvers = {
  Query: {
    login: async (_, args) => {
      console.log('login');
      try {
        await schema.validate(args, { abortEarly: false });
      } catch {
        return formatYupError(err);
      }
      const { email, password } = args;
      console.log('ready');
      const userData = await User.findOne({ email });
      if (!userData) {
        throw new Error(`Couldn't find email: ${email}`);
        //return { message: 'Такой пользователь не найден' };
      }
      const isMatch = await bcrypt.compare(password, userData.password);
      if (!isMatch) {
        return { message: 'Невірний пароль, спробуйте знову' };
      }
      const token = jwt.sign(
        { userId: userData._id },
        config.get('jwtSecret')
        //{ expiresIn: '1h'}
      );
      return {
        id: userData._id,
        name: userData.name,
        email: userData.email,
        channels: userData.channels,
        directMessages: userData.directMessages,
        token,
      };
    },
  },

  Mutation: {
    addUser: async (_, args) => {
      try {
        await schema.validate(args, { abortEarly: false });
      } catch (err) {
        return formatYupError(err);
      }
      const hashPassword = await bcrypt.hash(args.password, 12);
      const user = new User({
        name: args.name,
        email: args.email,
        password: hashPassword,
      });
      const newUser = await user.save();
      const token = jwt.sign(
        { userId: newUser._id },
        config.get('jwtSecret')
        //{ expiresIn: '1h'}
      );
      return {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        channels: newUser.channels,
        directMessages: newUser.directMessages,
        token,
      };
    },
    updateUser: (_, { id, name }) => {
      return User.findByIdAndUpdate(id, { $set: { name } }, { new: true });
    },
    deleteUser: async (_, { id }) => {
      return User.findByIdAndRemove(id);
    },
  },
};

module.exports = resolvers;
