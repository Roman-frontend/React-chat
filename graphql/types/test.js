/* 
Закінчив на 6.1


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
const jwt = require('jsonwebtoken');
const config = require('config');

const AuthType = new GraphQLObjectType({
  name: 'Auth',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    channels: { type: new GraphQLList(GraphQLString) },
    directMessages: { type: new GraphQLList(GraphQLString) },
    token: { type: GraphQLString },
  }),
});

exports.Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    login: {
      type: AuthType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(parent, { email, password }) {
        console.log('login');
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
  },
});
 */
