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

function infoError(err) {
  if (err) console.log(err);
  console.log('updated');
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

const AuthType = new GraphQLObjectType({
  name: 'Auth',
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
    name: { type: GraphQLString },
    creator: { type: GraphQLID },
    description: { type: GraphQLString },
    members: { type: new GraphQLList(GraphQLID) },
    isPrivate: { type: GraphQLBoolean },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  }),
});

const InviterType = new GraphQLObjectType({
  name: 'Inviter',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
  }),
});

const InvitedType = new GraphQLObjectType({
  name: 'Invited',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
  }),
});

const DirectMessageType = new GraphQLObjectType({
  name: 'DirectMessage',
  fields: () => ({
    id: { type: GraphQLID },
    inviter: { type: new GraphQLNonNull(InviterType) },
    invited: { type: InvitedType },
    createdAt: { type: GraphQLString },
  }),
});
const RemovedDirectMessageType = new GraphQLObjectType({
  name: 'RemovedDirectMessage',
  fields: () => ({
    id: { type: GraphQLID },
  }),
});

const MessageType = new GraphQLObjectType({
  name: 'Message',
  fields: () => ({
    id: { type: GraphQLID },
    userName: { type: GraphQLString },
    userId: { type: GraphQLID },
    text: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    replyOn: { type: GraphQLString },
    chatType: { type: GraphQLString },
    chatId: { type: GraphQLID },
  }),
});

const ChatType = new GraphQLObjectType({
  name: 'Chat',
  fields: () => ({
    id: { type: GraphQLID },
    chatMessages: { type: new GraphQLList(MessageType) },
  }),
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    login: {
      type: AuthType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(parent, args) {
        console.log('login');
        try {
          await schema.validate(args, { abortEarly: false });
        } catch {
          return formatYupError(err);
        }
        const { email, password } = args;
        const userData = await User.findOne({ email });
        if (!userData) {
          return { message: 'Такой пользователь не найден' };
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
    userChannels: {
      type: new GraphQLList(ChannelType),
      args: { channelsId: { type: new GraphQLList(GraphQLID) } },
      async resolve(parent, { channelsId }) {
        if (channelsId) {
          let userChannels = [];
          for (let id of channelsId) {
            const findChannel = await Channel.findById(id);
            console.log(findChannel);
            userChannels = userChannels.concat(findChannel);
          }
          return userChannels;
        } else {
          return Channel.find({});
        }
      },
    },
    users: {
      type: new GraphQLList(UserType),
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        if (args && args.id) {
          return User.findById(args.id);
        } else {
          return User.find({});
        }
      },
    },
    filteredUsers: {
      type: new GraphQLList(AuthType),
      args: { name: { type: GraphQLString } },
      resolve(parent, { name }) {
        return User.find({ name: { $regex: name, $options: 'i' } });
      },
    },
    messages: {
      type: ChatType,
      args: {
        chatId: { type: new GraphQLNonNull(GraphQLID) },
        chatType: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, { chatId, chatType }) {
        /* const isNotMember = await checkAccesToChannel(chatId, userId);
        if (isNotMember) {
          return;
        } */
        console.log('geting messages...', chatId, chatType);
        if (chatType === 'DirectMessage') {
          const chatMessages = await DirectMessageChat.find({ chatId });
          return { id: chatMessages[0].chatId, chatMessages };
        } else if (chatType === 'Channel') {
          const chatMessages = await ChannelMessage.find({ chatId });
          return { id: chatMessages[0].chatId, chatMessages };
        }
      },
    },
    directMessages: {
      type: new GraphQLList(DirectMessageType),
      args: {
        id: { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) },
      },
      async resolve(parent, { id }) {
        //console.log('getDirectMessages: ', id);
        let allFinded = [];
        for (let directMessageId of id) {
          const finded = await DirectMessage.findById(directMessageId);
          //console.log(finded);
          if (finded) {
            allFinded.push({
              id: finded._id,
              inviter: {
                id: finded.inviter._id,
                name: finded.inviter.name,
                email: finded.inviter.email,
              },
              invited: {
                id: finded.invited._id,
                name: finded.invited.name,
                email: finded.invited.email,
              },
              createdAt: finded.createdAt,
            });
          }
        }
        //console.log('getDirectMessages: ', allFinded);
        return allFinded;
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    //user mutations
    addUser: {
      type: AuthType,
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
    updateUser: {
      type: AuthType,
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
    deleteUser: {
      type: AuthType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent, args) {
        //з допомогою mongoose метода .findByIdAndRemove() - шукаємо модель з id - args.id  - і видаляємо його
        return User.findByIdAndRemove(args.id);
      },
    },

    //message mutations
    createMessage: {
      type: MessageType,
      args: {
        userName: { type: GraphQLString },
        userId: { type: GraphQLID },
        text: { type: GraphQLString },
        replyOn: { type: GraphQLString },
        createdAt: { type: GraphQLString },
        chatId: { type: GraphQLID },
        chatType: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const { chatType } = args;
        let newMessage;
        if (chatType === 'Channel') {
          newMessage = await ChannelMessage.create(args);
        } else if (chatType === 'DirectMessage') {
          newMessage = await DirectMessageChat.create(args);
        }
        return newMessage;
      },
    },
    changeMessage: {
      type: MessageType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        text: { type: new GraphQLNonNull(GraphQLString) },
        chatType: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, { id, text, chatType }) {
        if (chatType === 'Channel') {
          return ChannelMessage.findOneAndUpdate(
            { _id: id },
            { text },
            { useFindAndModify: false, new: true },
            (err) => infoError(err)
          );
        } else if (chatType === 'DirectMessage') {
          return DirectMessageChat.findOneAndUpdate(
            { _id: id },
            { text },
            { useFindAndModify: false, new: true },
            (err) => infoError(err)
          );
        }
      },
    },
    removeMessage: {
      type: MessageType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        chatType: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, { id, chatType }) {
        if (chatType === 'Channel') {
          await ChannelMessage.findByIdAndRemove(
            { _id: id },
            { useFindAndModify: false, new: true }
          );
        } else if (chatType === 'DirectMessage') {
          await DirectMessageChat.findByIdAndRemove(
            { _id: id },
            { useFindAndModify: false, new: true }
          );
        }
      },
    },

    //direct message mutations
    createDirectMessage: {
      type: new GraphQLList(DirectMessageType),
      args: {
        inviter: { type: new GraphQLNonNull(GraphQLID) },
        invited: { type: new GraphQLList(GraphQLID) },
      },
      async resolve(parent, { inviter, invited }) {
        let allNew = [];
        for (let invitedId of invited) {
          const dbInviter = await User.findById(inviter);
          const dbInvited = await User.findById(invitedId);
          const newDrMsg = await DirectMessage.create({
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

          dbInviter.directMessages.push(newDrMsg._id);
          await dbInviter.save();

          dbInvited.directMessages.push(newDrMsg._id);
          await dbInvited.save();

          allNew = allNew.concat({
            id: newDrMsg._id,
            inviter: {
              id: newDrMsg.inviter._id,
              name: newDrMsg.inviter.email,
              email: newDrMsg.inviter.email,
            },
            invited: {
              id: newDrMsg.invited._id,
              name: newDrMsg.invited.name,
              email: newDrMsg.invited.email,
            },
            createdAt: newDrMsg.createdAt,
          });
        }
        return allNew;
      },
    },
    createChannel: {
      type: ChannelType,
      args: {
        token: { type: GraphQLString },
        creator: { type: GraphQLID },
        name: { type: GraphQLString },
        members: { type: new GraphQLList(GraphQLID) },
        discription: { type: GraphQLString },
        isPrivate: { type: GraphQLBoolean },
      },
      async resolve(parent, args) {
        console.log(args);
        const newChannel = await Channel.create({ ...args });
        for (let memberId of args.members) {
          const user = await User.findById(memberId);
          user.channels.push(newChannel._id);
          await user.save();
        }
        return newChannel;
      },
    },
    addMember: {
      type: ChannelType,
      args: {
        token: { type: new GraphQLNonNull(GraphQLString) },
        invited: { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) },
        chatId: { type: new GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent, { token, invited, chatId }) {
        for await (const invitedId of invited) {
          const addedUser = await User.findById(invitedId);
          addedUser.channels.push(chatId);
          await addedUser.save();

          const activeChannel = await Channel.findById(chatId);
          activeChannel.members.push(invitedId);
          await activeChannel.save();
        }
        return Channel.findById(chatId);
      },
    },

    removeDirectMessage: {
      type: DirectMessageType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        chatType: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, { id, chatType }) {
        const removed = await DirectMessage.findByIdAndRemove(
          { _id: id },
          { useFindAndModify: false, new: true }
        );
        const inviter = await User.findById(removed.inviter._id);
        const updaterInvited = inviter.directMessages.filter(
          (drMsg) => drMsg != id
        );
        await User.findOneAndUpdate(
          { _id: removed.inviter._id },
          { directMessages: updaterInvited },
          { useFindAndModify: false, new: true },
          (err) => infoError(err)
        );

        const invited = await User.findById(removed.invited._id);
        const updatedInvited = invited.directMessages.filter(
          (drMsg) => drMsg != id
        );
        await User.findOneAndUpdate(
          { _id: removed.invited._id },
          { directMessages: updatedInvited },
          { useFindAndModify: false, new: true },
          (err) => infoError(err)
        );
        for (;;) {
          const removedMessage = await DirectMessageChat.findOneAndDelete({
            chatId: id,
          });
          if (!removedMessage) {
            break;
          }
        }
      },
    },
    removeChannel: {
      type: ChannelType,
      args: {
        channelId: { type: new GraphQLNonNull(GraphQLID) },
        userId: { type: new GraphQLNonNull(GraphQLID) },
        token: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, { channelId, userId, token }) {
        console.log('removeChannel -> ', channelId, userId);
        const channel = await Channel.findById(channelId);
        const filteredMembers = channel.members.filter((id) => id != userId);
        if (filteredMembers[0]) {
          await Channel.findOneAndUpdate(
            { _id: channelId },
            { members: filteredMembers },
            { useFindAndModify: false, new: true },
            (err) => infoError(err)
          );
        } else {
          await Channel.findByIdAndRemove(
            { _id: channelId },
            { useFindAndModify: false, new: true }
          );
          for (;;) {
            const removedMessage = await ChannelMessage.findOneAndDelete({
              chatId: channelId,
            });
            if (!removedMessage) {
              break;
            }
          }
        }

        const user = await User.findById(userId);
        const filteredChannels = user.channels.filter((id) => id != channelId);
        await User.findOneAndUpdate(
          { _id: userId },
          { channels: filteredChannels },
          { useFindAndModify: false, new: true },
          (err) => infoError(err)
        );
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
