// Тут описано бізнес-логіку (Service)
const DirectMessageChat = require("../models/DirectMessageChat");
const ChannelMessage = require("../models/ChannelMessage");
const { checkAccesToChannel, infoError } = require("../graphql/helpers");

class ConversationService {
  async getMessagesFromDM(chatId) {
    const chatMessages = await DirectMessageChat.find({ chatId });
    return { id: chatId, chatMessages };
  }

  async getMessagesFromChannel({ chatId, userId }) {
    const isNotMember = await checkAccesToChannel(chatId, userId);
    if (isNotMember) return;
    let chatMessages = await ChannelMessage.find({ chatId });
    if (!chatMessages) chatMessages = [];
    return { id: chatId, chatMessages };
  }

  async createMessageInChannel(data) {
    return await ChannelMessage.create(data);
  }

  async createMessageInDM(data) {
    return await DirectMessageChat.create(data);
  }

  async changeMessageInChannel({ id, text }) {
    return ChannelMessage.findOneAndUpdate(
      { _id: id },
      { text: text },
      { useFindAndModify: false, new: true },
      (err) => infoError(err)
    );
  }

  async changeMessageInDM({ id, text }) {
    return DirectMessageChat.findOneAndUpdate(
      { _id: id },
      { text: text },
      { useFindAndModify: false, new: true },
      (err) => infoError(err)
    );
  }

  async removeMessageInChannel(id) {
    await ChannelMessage.findByIdAndRemove(
      { _id: id },
      { useFindAndModify: false, new: true }
    );
  }

  async removeMessageInDM(id) {
    await DirectMessageChat.findByIdAndRemove(
      { _id: id },
      { useFindAndModify: false, new: true }
    );
  }
}

module.exports = new ConversationService();
