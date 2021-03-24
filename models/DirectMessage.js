const { Schema, model } = require('mongoose');

const DirectMessage = model(
  'DirectMessage',
  new Schema({
    inviter: { type: Object, required: true },
    invited: { type: Object, required: true },
    createdAt: { type: String, default: Date.now },
  })
);

module.exports = DirectMessage;
