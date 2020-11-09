const {Router} = require('express')
const config = require('config')
const Channel = require('../models/Channel.js')
const User = require('../models/User.js')
const router = Router()
const jsonWebToken = require('jsonwebtoken');

//Coming from SetUser
router.get(`/get-users:userId`, verifyToken,
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
  '/post-channel:userId', verifyToken,
  async (req, res) => {
  try {
    const newChannel = await Channel.create(req.body)
    const userData = await User.findOne({ _id: req.params.userId })
    const idChunnels = userData.channels.concat(newChannel._id)
    const addChannelToUser = await User.findOneAndUpdate(
      { _id: req.params.userId }, 
      { channels: idChunnels },
      //без {new: true} - в addChannelToUser буде поміщено старе значення.
      {new: true},
      function (error, success) { console.log(error ? error : success) }
    );

    res.status(201).json({userData, channel: newChannel, message : 'Канал створено'})

  } catch (e) {
  	res.status(500).json({message: "Что-то пошло не так -", error: e})
  }
})

//Coming from AddPeopleToChannel
router.post(
  '/post-add-members-to-channel:activeChannelId', verifyToken,
  async (req, res) => {
  try {
    const channelWithPushedMember = await Channel.findOneAndUpdate(
      { _id: req.params.activeChannelId }, 
      { $push: { members: req.body[0]  } }, 
      function (error, success) { console.log(error ? error : null) }
    );
    const userWithPushedChannel = await User.findOneAndUpdate(
      { _id: req.body[0] }, 
      { $push: { channels: req.params.activeChannelId } }, 
      function (error, success) { console.log(error ? error : null) }
    );

    res.status(201).json({dataMember: userWithPushedChannel, message : 'Учасника додано'})

  } catch (e) {
    res.status(500).json({message: "Что-то пошло не так -", error: e})
  }
})


//Coming from Channels, 
router.post(
  '/get-chunnels', verifyToken,
  async (req, res) => {
  try {
    //НЕ ВИДАЛЯТИ (ВІДПРАВЛЯЄ НА ФРОНТЕНД КАНАЛИ АКТИВНОГО КОРИСТУВАЧА)
    //let userChannels = []
    //for (const channelId of req.body ) {
      //const channel = await Channel.find({ _id: channelId })
      //userChannels = userChannels.concat(channel)
    //}
    const userChannels = await Channel.find({})
    //console.log("getChannels ==>> ", userChannels)
    res.json({userChannels, message : 'Channels responsed'})

  } catch (e) {
    console.log('failed in get-messages')
    res.status(500).json({message: "Помилка при виконанні get-запиті ", error: e})
  }
})

function verifyToken( req, res, next ) {
  const token = req.headers['authorization'];

  if (token == null) {
    return res.sendStatus(401)

  } else {
    jsonWebToken.verify(token, config.get("jwtSecret"), (err, success) => {
      if (err) {
        console.log(`error in verifyToken ${err}`); 
        res.sendStatus(403)

      } else next()
    })
  }
}


module.exports = router;