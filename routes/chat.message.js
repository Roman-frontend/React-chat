const {Router} = require('express')
const config = require('config')
const Message = require('../models/Message.js')
const router = Router()

router.post(
  '/post-message', [],
  async (req, res) => {
  try {
    const {username, text, createdAt, id, reply} = req.body	
    const message = new Message({username: username, text: text, reply: reply, createdAt: createdAt})
    console.log('post-message -> text -> ', message)
    await message.save(function (err) {
      if (err) return console.log(err)
    })

    console.log('post-message -> after .save()', message)
    const messages = await Message.find({'username': 'Yulia'})
    res.status(201).json({messages, message : 'Сообщение создано'})
  } catch (e) {
    console.log("catch - post-message")
  	res.status(500).json({message: "Что-то пошло не так "})
  }
})

router.get('/get-messages', async (req, res) => {
  try {
    const messages = await Message.find({'username': 'Yulia'})
    res.json({messages, message : 'Повідомлення повернені'})
  } catch (e) {
    res.status(500).json({message: "Что-то пошло не так "})
  }
})

router.delete(
  '/delete-message:_id', 
  async (req, res) => {
  try {
    console.log('post-delete -> before remove id', req.params._id)
    await Message.findByIdAndRemove(req.params._id)
    console.log('post-delete -> after remove id')

    res.status(201).json({message : 'Сообщение удалено'})
  } catch (e) {
    console.log("catch - delete-message")
    res.status(500).json({message: "Что-то пошло не так "})
  }
})

router.put(
  '/put-message:_id', 
  async (req, res) => {
  try {
    await Message.findByIdAndUpdate(req.params._id, req.body)
    const messages = await Message.find({'username': 'Yulia'})
    console.log('put-message -> after change', messages)
    res.status(201).json({messages, message : 'Повідомлення змінене'})
  } catch (e) {
    console.log("catch - put-message")
    res.status(500).json({message: "Что-то пошло не так "})
  }
})

module.exports = router;