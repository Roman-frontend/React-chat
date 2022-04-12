const User = require("../../models/User");
const AppService = require("../../Service/AppService");

const resolvers = {
  Query: {
    users: (_, args, context) => {
      if (!context.isAuth) throw new Error("you must be logged in");
      const fined = AppService.getUsers(args);
      return fined;
    },
  },
};

module.exports = resolvers;
