const {Router} = require('express')
const config = require('config')
const Channel = require('../models/Channel.js')
const Message = require('../models/Message')
const User = require('../models/User.js')
const router = Router()

async function checkBelongToPrivatChannel(channelId, userId) {
  const activeChannel = await Channel.findOne({ _id: channelId })
  return activeChannel.isPrivate && !activeChannel.members.includes(userId) ? true : false
}

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

//Coming from Channels, Messages
router.post('/get-messages:activeChannelId',
  async (req, res) => {
  try {
    const userIsNotMemberPrivatChannel = checkBelongToPrivatChannel(req.params.activeChannelId, req.body.userId)

    if (userIsNotMemberPrivatChannel) {
      res.status(403).json({message: "Ви не є учасником приватного чату"})

    } else {
      const messages = await Message.find({'channelId': req.params.activeChannelId})
      res.json({messages, message : 'Повідомлення повернені'})
    }
  } catch (e) {
    res.status(500).json({message: "Помилка при виконанні get-запиту ", error: e})
  }
})

//Coming from InputUpdateMessages
router.post(
  '/post-message:activeChannelId',
  async (req, res) => {
  try {
    const userIsNotMemberPrivatChannel = checkBelongToPrivatChannel(req.params.activeChannelId, req.body.userId)

    if (userIsNotMemberPrivatChannel) {
      res.status(403).json({message: "Ви не є учасником приватного чату"})

    } else {
      let channelMessages
      const createdMessage = await Message.create(req.body)
      if (req.params.activeChannelId) {
        channelMessages = await Message.find({'channelId': req.params.activeChannelId})
      }
      res.status(201).json({channelMessages, message : 'Повідомлення змінене'})
    }
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
    await Message.findByIdAndRemove(req.params.id)

    res.status(201).json({removed: true, message : 'Сообщение удалено'})
  } catch (e) {
    console.log("catch - delete-message")
    res.status(500).json({removed: false, message: "Что-то пошло не так "})
  }
})

module.exports = router;
