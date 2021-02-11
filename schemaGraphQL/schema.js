const bcrypt = require('bcryptjs');
const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
} = graphql;
const User = require('../models/User.js');
const Channel = require('../models/Channel.js');
const jwt = require('jsonwebtoken');
const yup = require('yup');
const config = require('config');
const {
  nameNotLongEnough,
  duplicateEmail,
  emailNotLongEnough,
  invalidEmail,
  passwordNotLongEnough,
} = require('./errorMessages');
const { formatYupError } = require('./formatYupError');

const schema = yup.object().shape({
  name: yup.string().min(3, nameNotLongEnough).max(255),
  email: yup.string().min(3, emailNotLongEnough).max(255).email(invalidEmail),
  password: yup.string().min(3, passwordNotLongEnough).max(255),
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLString },
    token: { type: GraphQLString },
    errors: { type: GraphQLString },
  }),
});

const ChannelType = new GraphQLObjectType({
  name: 'Channel',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    creator: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    members: { type: GraphQLString },
    isPrivate: { type: GraphQLBoolean },
  }),
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args) {
        try {
          await schema.validate(args, { abortEarly: false });
        } catch (err) {
          //console.log(err);
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
          token,
        };
      },
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent, args) {
        //з допомогою mongoose метода .findByIdAndRemove() - шукаємо модель з id - args.id  - і видаляємо його
        return User.findByIdAndRemove(args.id);
      },
    },
    updateUser: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return User.findByIdAndUpdate(
          args.id,
          { $set: { name: args.name } },
          { new: true }
        );
      },
    },
  },
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return User.findById(args.id);
      },
    },
    channel: {
      type: ChannelType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Channel.findById(args.id);
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return User.find({});
      },
    },
    filteredUsers: {
      type: new GraphQLList(UserType),
      args: { name: { type: GraphQLString } },
      resolve(parent, { name }) {
        return User.find({ name: { $regex: name, $options: 'i' } });
      },
    },
    channels: {
      type: new GraphQLList(ChannelType),
      resolve(parent, args) {
        return Channel.find({});
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
