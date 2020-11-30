const { Schema, model } = require("mongoose");

const Channels = model(
  "Channel",
  new Schema(
    {
      name: { type: String, required: true },
      creator: { type: String, required: true },
      description: { type: String },
      members: { type: Array },
      isPrivate: { type: Boolean, default: false },
    },
    { timestamps: true }
  )
);

module.exports = Channels;
