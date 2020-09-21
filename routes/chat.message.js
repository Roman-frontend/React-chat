const {Router} = require('express')
const config = require('config')
const Message = require('../models/Message')
const User = require('../models/User.js')
const router = Router()

//coming from SetUser
router.get(`/get-users:userId`,
  async (req, res) => {
  try {
    const users = await User.find({})
    const names = users.map(user => {
      return user.name
    })
    res.json({names, message : 'Імена повернені'})
  } catch (e) {
    res.status(500).json({message: "Помилка при виконанні get-запиту ", error: e})
  }
})

//Coming from SetUser
router.get(`/get-messages:activeChannelId`,
  async (req, res) => {
  try {
    console.log('channelId ', req.params.activeChannelId)
    const messages = await Message.find({'channelId': req.params.activeChannelId})
    res.json({messages, message : 'Повідомлення повернені'})
  } catch (e) {
    res.status(500).json({message: "Помилка при виконанні get-запиту ", error: e})
  }
})

//Coming from InputUpdateMessages
router.post(
  '/post-message:activeChannelId',
  async (req, res) => {
  try {
    let channelMessages
    const createdMessage = await Message.create(req.body)
    if (req.params.activeChannelId) {
      channelMessages = await Message.find({'channelId': req.params.activeChannelId})
    }
    console.log('post-message: ', req.params.activeChannelId, channelMessages)
    res.status(201).json({channelMessages, message : 'Повідомлення змінене'})
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
  '/delete-message:id', 
  async (req, res) => {
  try {
    console.log('post-delete -> before remove id', req.params.id)
    await Message.findByIdAndRemove(req.params.id)
    console.log('post-delete -> after remove id')

    res.status(201).json({message : 'Сообщение удалено'})
  } catch (e) {
    console.log("catch - delete-message")
    res.status(500).json({message: "Что-то пошло не так "})
  }
})

module.exports = router;
