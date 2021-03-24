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
const ChannelMessage = require('../models/ChannelMessage.js');
const DirectMessageChat = require('../models/DirectMessageChat.js');
const DirectMessage = require('../models/DirectMessage.js');
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

async function checkAccesToChannel(chatId, userId) {
  const channel = await Channel.findById(chatId);
  return channel.isPrivate && !channel.members.includes(userId) ? true : false;
}

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLString },
    channels: { type: new GraphQLList(GraphQLString) },
    directMessages: { type: new GraphQLList(GraphQLString) },
    token: { type: GraphQLString },
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

const InviterType = new GraphQLObjectType({
  name: 'Inviter',
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const InvitedType = new GraphQLObjectType({
  name: 'Invited',
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const DirectMessageType = new GraphQLObjectType({
  name: 'DirectMessage',
  fields: () => ({
    _id: { type: GraphQLID },
    inviter: { type: new GraphQLNonNull(InviterType) },
    invited: { type: InvitedType },
    createdAt: { type: GraphQLString },
  }),
});

const DirectMessagesType = new GraphQLObjectType({
  name: 'DirectMessages',
  fields: () => ({
    directMessages: { type: new GraphQLList(DirectMessageType) },
  }),
});

const MessageType = new GraphQLObjectType({
  name: 'Message',
  fields: () => ({
    id: { type: GraphQLID },
    userName: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLString) },
    text: { type: new GraphQLNonNull(GraphQLString) },
    replyOn: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    chatId: { type: new GraphQLNonNull(GraphQLString) },
    chatType: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    login: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(parent, args) {
        try {
          await schema.validate(args, { abortEarly: false });
        } catch {
          return formatYupError(err);
        }
        const { email, password } = args;
        const userData = await User.findOne({ email });
        if (!userData) {
          console.log('пользователь не найден');
          return { message: 'Такой пользователь не найден' };
        }
        const isMatch = await bcrypt.compare(password, userData.password);

        if (!isMatch) {
          console.log('неверний пароль');
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
    messages: {
      type: new GraphQLList(MessageType),
      async resolve() {
        const dbMessages = ChannelMessage.find({});
        return dbMessages;
      },
    },
    directMessages: {
      type: DirectMessagesType,
      args: { id: { type: GraphQLList(GraphQLID) } },
      async resolve(parent, args) {
        let allFinded = [];
        for (let id of args.id) {
          const finded = await DirectMessage.findById(id);
          allFinded.push(finded);
        }
        return { directMessages: allFinded };
      },
    },
  },
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
    createMessage: {
      type: MessageType,
      args: {
        userName: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLString) },
        text: { type: new GraphQLNonNull(GraphQLString) },
        replyOn: { type: GraphQLString },
        createdAt: { type: GraphQLString },
        chatId: { type: new GraphQLNonNull(GraphQLString) },
        chatType: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args) {
        const { userName, userId, text, replyOn, chatId, chatType } = args;
        let newMessage;
        if (chatType === 'Channel') {
          const isNotMember = await checkAccesToChannel(chatId, userId);
          if (isNotMember) {
            return;
          }
          newMessage = await ChannelMessage.create({
            userName,
            userId,
            text,
            replyOn,
            chatId,
            chatType,
          });
        } else if (chatType === 'DirectMessage') {
          newMessage = await DirectMessageChat.create({
            userName,
            userId,
            text,
            replyOn,
            chatId,
            chatType,
          });
        }
        return newMessage;
      },
    },
    changeMessage: {
      type: MessageType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        text: { type: new GraphQLNonNull(GraphQLString) },
        createdAt: { type: GraphQLString },
        chatType: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args) {
        const { id, text, createdAt, chatType } = args;
        function infoError(err) {
          if (err) console.log(err);
          console.log('updated');
        }
        let updatedMessage;
        if (chatType === 'Channel') {
          updatedMessage = await ChannelMessage.findOneAndUpdate(
            { _id: id },
            { text: text },
            { useFindAndModify: false, new: true },
            (err) => infoError(err)
          );
        } else if (chatType === 'DirectMessage') {
          updatedMessage = await DirectMessageChat.findOneAndUpdate(
            { _id: id },
            { text: text },
            { useFindAndModify: false, new: true },
            (err) => infoError(err)
          );
        }
        return updatedMessage;
      },
    },
    createDirectMessage: {
      type: DirectMessagesType,
      args: {
        inviter: { type: new GraphQLNonNull(GraphQLID) },
        invited: { type: new GraphQLList(GraphQLID) },
      },
      async resolve(parent, args) {
        console.log(args);
        const { inviter, invited } = args;
        console.log('createdDire', invited);
        let allNew = [];

        for (let invitedId of invited) {
          const dbInviter = await User.findById(inviter);
          const dbInvited = await User.findById(invitedId);

          const newDirectMessage = await DirectMessage.create({
            inviter: {
              _id: dbInviter._id,
              name: dbInviter.name,
              email: dbInviter.email,
            },
            invited: {
              _id: dbInvited._id,
              name: dbInvited.name,
              email: dbInvited.email,
            },
          });
          console.log(newDirectMessage, invitedId);

          dbInviter.directMessages.push(newDirectMessage._id);
          await dbInviter.save();

          dbInvited.directMessages.push(newDirectMessage._id);
          await dbInvited.save();

          console.log(newDirectMessage);
          allNew = allNew.concat(newDirectMessage);
        }

        console.log('line 384', allNew);
        return { directMessages: allNew };
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
