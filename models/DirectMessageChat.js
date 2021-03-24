const { Schema, model } = require('mongoose');

const DirectMessageChat = new Schema({
  replyOn: { type: String },
  userName: { type: String, required: true },
  userId: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: String, default: Date.now, required: true },
  chatId: { type: String },
  chatType: { type: String, default: 'DirectMessage' },
});

module.exports = model('DirectMessageChat', DirectMessageChat);
