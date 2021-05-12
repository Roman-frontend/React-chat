const { Schema, model } = require('mongoose');

const DirectMessage = new Schema({
  members: { type: Array, required: true },
  createdAt: { type: String, default: Date.now },
});

if (!DirectMessage.options.toObject) {
  DirectMessage.options.toObject = {};
}
DirectMessage.options.toObject.transform = function (doc, ret, options) {
  ret.id = ret._id;
  delete ret._id;
  return ret;
};

module.exports = model('DirectMessage', DirectMessage);
