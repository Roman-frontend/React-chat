const {Router} = require('express')
const config = require('config')
const Channel = require('../models/Channel.js')
const User = require('../models/User.js')
const router = Router()

//Coming from SetUser
router.get(`/get-chunnels:userId`, [],
  async (req, res) => {
  try {
    //const userMessages = await Message.find({})
    const userChannels = await Channel.find({'creator': req.params.userId})
    res.json({userChannels, message : 'Channels responsed'})
  } catch (e) {
    console.log('failed in get-messages')
    res.status(500).json({message: "Помилка при виконанні get-запиті ", error: e})
  }
})

//Coming from SetUser
router.get(`/get-users:userId`, [],
  async (req, res) => {
  try {
    const users = await User.find({})
    res.json({users, message : 'Users responsed'})
  } catch (e) {
    console.log('failed in get-users')
    res.status(500).json({message: "Помилка при виконанні get-запиті ", error: e})
  }
})

//Coming from AddChannel
router.post(
  '/post-channel', [],
  async (req, res) => {
  try {
    const channel = await Channel.create(req.body)
    console.log(channel)
    res.status(201).json({channel, message : 'Канал створено'})
  } catch (e) {
  	res.status(500).json({message: "Что-то пошло не так -", error: e})
  }
})

router.post(
  '/post-add-members-to-channel:activeChannelId',
  async (req, res) => {
  try {
    const channelWithMembers = Channel.findOneAndUpdate(
      { _id: req.params.activeChannelId }, 
      { $push: { members: req.body[0]  } }, 
      function (error, success) { console.log(error ? error : success) }
    );
    const activeChannel = await Channel.find({'_id': req.params.activeChannelId})
    res.status(201).json({message : 'Канал створено'})
  } catch (e) {
    res.status(500).json({message: "Что-то пошло не так -", error: e})
  }
})

module.exports = router;