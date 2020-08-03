const {Router} = require('express')
const config = require('config')
const Channel = require('../models/Channel.js')
const User = require('../models/User.js')
const router = Router()
/*
router.get(`/get-messages:userId`, [],
  async (req, res) => {
  try {
    const userMessages = await Message.find({'userId': req.params.userId})
    const users = await User.find({})
    const usersNames = users.map(user => {
      return user.name
    })
    console.log('users - ', usersNames)
    res.json({messages: userMessages, usersNames: usersNames, message : 'Повідомлення повернені'})
  } catch (e) {
    console.log('failed in get-messages')
    res.status(500).json({message: "Помилка при виконанні get-запиті ", error: e})
  }
})*/

router.post(
  '/post-channel', [],
  async (req, res) => {
  try {
    const createdMessage = await Channel.create(req.body)
    console.log(createdMessage)
    res.status(201).json({message : 'Канал створено'})
  } catch (e) {
  	res.status(500).json({message: "Что-то пошло не так -", error: e})
  }
})

module.exports = router;