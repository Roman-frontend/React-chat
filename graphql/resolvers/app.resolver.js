const User = require('../../models/User');

const resolvers = {
  Query: {
    users: (_, { id }, context) => {
      if (!context.isAuth) throw new Error('you must be logged in');
      if (id) {
        return User.findById(id);
      } else {
        return User.find({});
      }
    },
  },
};

module.exports = resolvers;
