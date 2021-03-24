const { Schema, model } = require('mongoose');

/** Модель повідомлення */
const ChannelMessage = new Schema({
  replyOn: { type: String },
  userName: { type: String, required: true },
  userId: { type: String, required: true },
  text: { type: String, required: true },
  /** default: Date.now - вказує дату по замовчуванні*/
  createdAt: { type: String, default: Date.now, required: true },
  /** Можливі свойства: Schema.Types.Mixed - задати будь-який тип в схемі, []: Массив элементов,
   * для типу Numder - min: 1, max: 100 - встроєний валідатор що вказує доступні дані для запису: від 1 до 100
   * required: true - вказує що поле обовʼязково має бути задане перед збереженням  */
  chatId: { type: String },
  chatType: { type: String, default: 'Channel' },
});

/**
 * .model() - створює моделі зі схем
 * @params - Первый аргумент - уникальное имя создаваемой для модели коллекции(Mongoose создаст коллекцию для модели Message),
 * @params - Второй аргумент - схема, которая используется для создания модели.
 */
module.exports = model('ChannelMessage', ChannelMessage);
