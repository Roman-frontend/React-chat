const { Schema, model } = require('mongoose');

/** Модель повідомлення */
let ChannelMessage = new Schema(
  {
    replyOn: { type: String },
    senderId: { type: String, required: true },
    text: { type: String, required: true },
    /** default: Date.now - вказує дату по замовчуванні*/
    createdAt: { type: String, default: Date.now, required: true },
    /** Можливі свойства: Schema.Types.Mixed - задати будь-який тип в схемі, []: Массив элементов,
     * для типу Numder - min: 1, max: 100 - встроєний валідатор що вказує доступні дані для запису: від 1 до 100
     * required: true - вказує що поле обовʼязково має бути задане перед збереженням  */
    chatId: { type: String },
    chatType: { type: String, default: 'Channel' },
  },
  { timestamps: true }
);

if (!ChannelMessage.options.toObject) {
  ChannelMessage.options.toObject = {};
}
ChannelMessage.options.toObject.transform = function (doc, ret, options) {
  ret.id = ret._id;
  delete ret._id;
  return ret;
};

/**
 * .model() - створює моделі зі схем
 * @params - Первый аргумент - уникальное имя создаваемой для модели коллекции(Mongoose создаст коллекцию для модели Message),
 * @params - Второй аргумент - схема, которая используется для создания модели.
 */
module.exports = model('ChannelMessage', ChannelMessage);
