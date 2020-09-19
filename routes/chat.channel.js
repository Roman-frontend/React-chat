const {Router} = require('express')
const config = require('config')
const Message = require('../models/Message')
const Channel = require('../models/Channel.js')
const User = require('../models/User.js')
const router = Router()


router.get(`/get-messages:userId`, [],
  async (req, res) => {
  try {
    /*const userMessages = await Message.find({'userId': req.params.userId})
    const users = await User.find({})
    const usersNames = users.map(user => {
      return user.name
    })*/
    const userMessages = await Message.find({})
    console.log('userMessages - ', userMessages)
    const userChannels = await Channel.find({'userId': req.params.userId})
    res.json({userMessages, userChannels, message : 'Channels responsed'})
  } catch (e) {
    console.log('failed in get-messages')
    res.status(500).json({message: "Помилка при виконанні get-запиті ", error: e})
  }
})

router.post(
  '/post-channel', [],
  async (req, res) => {
  try {
    console.log("req ", req.body)
    const createdMessage = await Channel.create(req.body)
    console.log(createdMessage)
    res.status(201).json({message : 'Канал створено'})
  } catch (e) {
  	res.status(500).json({message: "Что-то пошло не так -", error: e})
  }
})

module.exports = router;