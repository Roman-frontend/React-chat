const { Schema, model } = require('mongoose');

const DirectMessageChat = new Schema(
  {
    replyOn: { type: String },
    senderId: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: String, default: Date.now, required: true },
    chatId: { type: String },
    chatType: { type: String, default: 'DirectMessage' },
  },
  { timestamps: true }
);

module.exports = model('DirectMessageChat', DirectMessageChat);
