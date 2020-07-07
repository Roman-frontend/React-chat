const {Schema, model} = require('mongoose')

/**Модель користувача */
const schema = Schema({
  email: {type: String, required: true, unique: true}
  password: {type: String, required: true}
})

module.export = model('User', schema)