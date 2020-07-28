const {Schema, model} = require('mongoose')
const Message = require('./Message.js')
const mongoose = require('mongoose')

/**Модель користувача */
/*const User = new Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  message: [
    {
      type: Schema.Types.ObjectId,
      ref: "Message"
    }
  ]
})

module.exports = model('User', User)*/

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: { type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    message: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
      }
    ]
  })
);

module.exports = User;