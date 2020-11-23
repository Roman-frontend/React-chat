const {Schema, model} = require('mongoose')

const User = model(
  "User",
  new Schema({
    name: { type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    channels: {type: Array}
  })
);

module.exports = User;