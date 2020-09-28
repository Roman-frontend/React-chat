const {Router} = require('express')
const config = require('config')
const Channel = require('../models/Channel.js')
const User = require('../models/User.js')
const router = Router()

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
  '/post-channel:userId', [],
  async (req, res) => {
  try {
    const channel = await Channel.create(req.body)
    const addChannelToUser = await User.findOneAndUpdate(
      { _id: req.params.userId }, 
      { $push: { channels: channel._id  } }, 
      function (error, success) { console.log(error ? error : success) }
    );
    console.log("channel ", channel, "addChannelToUser ", addChannelToUser)
    res.status(201).json({channel, message : 'Канал створено'})
  } catch (e) {
  	res.status(500).json({message: "Что-то пошло не так -", error: e})
  }
})

//Coming from AddPeopleToChannel
router.post(
  '/post-add-members-to-channel:activeChannelId',
  async (req, res) => {
  try {
    const channelWithMembers = await Channel.findOneAndUpdate(
      { _id: req.params.activeChannelId }, 
      { $push: { members: req.body[0]  } }, 
      function (error, success) { console.log(error ? error : success) }
    );
    const pushedChannelUser = await User.findOneAndUpdate(
      { _id: req.body[0] }, 
      { $push: { channels: req.params.activeChannelId } }, 
      function (error, success) { console.log(error ? error : success) }
    );
    res.status(201).json({message : 'Учасника додано'})
  } catch (e) {
    res.status(500).json({message: "Что-то пошло не так -", error: e})
  }
})


//Coming from SetUser
router.post(
  '/post-chunnels',
  async (req, res) => {
  try {
    //const userMessages = await Message.find({})
    console.log("get-channels ", req.body)
    let userChannels = []
    for (const channelId of req.body ) {
      userChannels = await Channel.find({ _id: channelId })
    }
    res.json({userChannels, message : 'Channels responsed'})
  } catch (e) {
    console.log('failed in get-messages')
    res.status(500).json({message: "Помилка при виконанні get-запиті ", error: e})
  }
})

module.exports = router;