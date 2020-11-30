const { Schema, model } = require("mongoose");

const DirectMessage = model(
  "DirectMessage",
  new Schema({
    inviter: { type: String, required: true },
    invited: { type: Array, required: true },
    createdAt: { type: String, default: Date.now, required: true },
  })
);

module.exports = DirectMessage;
