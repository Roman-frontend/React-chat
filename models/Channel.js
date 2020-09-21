const {Schema, model} = require('mongoose')

const User = model(
  "Channel",
  new Schema({
    name: { type: String, required: true},
    creator: { type: String, required: true},
    description: {type: String},
    members: {type: Array},
  }, { timestamps: true })
);

module.exports = User;