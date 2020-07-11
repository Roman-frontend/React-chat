const {Schema, model} = require('mongoose')

/**Модель повідомлення */
const schema = new Schema({
  username: {type: String, required: true},
  text: {type: String, required: true},
  createdAt: {type: Date, required: true},
  id: {type: Number, required: true},
  listAction: {type: Boolean },
  changed: {type: Boolean},
  answer: {type: Boolean},
  reply: {type: String, required: true}
})

module.exports = model('User', schema)