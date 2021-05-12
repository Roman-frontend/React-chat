const { Schema, model } = require('mongoose');

const User = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  channels: { type: Array },
  directMessages: { type: Array },
});

if (!User.options.toObject) {
  User.options.toObject = {};
}
User.options.toObject.transform = function (doc, ret, options) {
  ret.id = ret._id;
  delete ret._id;
  return ret;
};

module.exports = model('User', User);
