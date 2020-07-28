const {Router} = require('express')
const config = require('config')
const Message = require('../models/Message.js')
const User = require('../models/User.js')
const router = Router()

router.get(`/get-messages:userId`, [],
  async (req, res) => {
  try {
    const userMessages = await Message.find({'userId': req.params.userId})
    console.log('userMessages -', userMessages)
    res.json({messages: userMessages, message : 'Повідомлення повернені'})
  } catch (e) {
    console.log('failed in get-messages')
    res.status(500).json({message: "Помилка при виконанні get-запиті ", error: e})
  }
})

router.post(
  '/post-message:_id', [],
  async (req, res) => {
  try {
    const createdMessage = await Message.create(req.body)
    res.status(201).json({message : 'Повідомлення змінене'})
  } catch (e) {
  	res.status(500).json({message: "Что-то пошло не так -", error: e})
  }
})

router.put(
  '/put-message:_id', 
  async (req, res) => {
  try {
    await Message.findByIdAndUpdate(req.params._id, req.body)
    const messages = await Message.find({'username': 'Yulia'})
    res.status(201).json({messages, message : 'Повідомлення змінене'})
  } catch (e) {
    console.log("catch - put-message")
    res.status(500).json({message: "Что-то пошло не так "})
  }
})

router.delete(
  '/delete-message:_id/message:messageId', 
  async (req, res) => {
  try {
    let messageForRemove
    const user = await User.findOne({'_id': req.params._id})
    res.status(201).json({message : 'Сообщение удалено'})
  } catch (e) {
    console.log("catch - delete-message")
    res.status(500).json({message: "Что-то пошло не так "})
  }
})

module.exports = router;
