// Тут описано бізнес-логіку (Service)
const User = require("../models/User.js");

class UserService {
  getUsers({ id }) {
    if (id) {
      return User.findById(id);
    } else {
      return User.find({});
    }
  }
}

module.exports = new UserService();
