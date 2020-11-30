const { Schema, model } = require("mongoose");

const DirectMessageChat = new Schema({
  reply: { type: String },
  username: { type: String, required: true },
  userId: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: String, default: Date.now, required: true },
  directMessageId: { type: String },
});

module.exports = model("DirectMessageChat", DirectMessageChat);
