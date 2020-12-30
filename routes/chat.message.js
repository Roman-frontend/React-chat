const { Router } = require('express');
const config = require('config');
const Channel = require('../models/Channel.js');
const ChannelMessage = require('../models/ChannelMessage');
const User = require('../models/User.js');
const router = Router();
const jsonWebToken = require('jsonwebtoken');

router.get(`/get-users:userId`, verifyToken, async (req, res) => {
  try {
    const users = await User.find({});
    const names = users.map((user) => {
      return user.name;
    });

    res.json({ names, message: 'Імена повернені' });
  } catch (e) {
    res
      .status(500)
      .json({ message: 'Помилка при виконанні get-запиту ', error: e });
  }
});

router.post('/get-messages:activeChannelId', verifyToken, async (req, res) => {
  try {
    console.log('validatedPostMessage => ', 'userHasAccesToChannel');
    const userHasAccesToChannel = await checkAccesToChannel(
      req.params.activeChannelId,
      req.body.userId
    );

    if (userHasAccesToChannel) {
      res.status(403).json({ message: 'Ви не є учасником приватного чату' });
    } else {
      const messages = await ChannelMessage.find({
        chatId: req.params.activeChannelId,
      });
      res.json({ messages, message: 'Повідомлення повернені' });
    }
  } catch (e) {
    res
      .status(500)
      .json({ message: 'Помилка при виконанні get-запиту ', error: e });
  }
});

router.post('/post-message:chatId', verifyToken, async (req, res) => {
  try {
    //console.log("without express.json ..........")
    /* const ip =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress; */

    //console.log('ip ////', ip);
    const userIsNotMemberPrivatChannel = await checkAccesToChannel(
      req.params.chatId,
      req.body.userId
    );
    //console.log("post-message ==>> ", userIsNotMemberPrivatChannel);
    if (userIsNotMemberPrivatChannel) {
      res.status(403).json({ message: 'Ви не є учасником приватного чату' });
    } else if (req.params.chatId) {
      const newMessage = await ChannelMessage.create(req.body);
      /* const messages = await ChannelMessage.find({
        chatId: req.params.chatId,
      }); */
      res.status(201).json({
        /* messages, */ newMessage,
        message: 'Повідомлення надіслано',
      });
    }
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так -', error: e });
  }
});

router.put('/put-message:_id', async (req, res) => {
  try {
    await ChannelMessage.findByIdAndUpdate(req.params._id, req.body);
    const messages = await ChannelMessage.find({ username: 'Yulia' });
    res
      .status(201)
      .json({ messages, newMessage, message: 'Повідомлення змінене' });
  } catch (e) {
    console.log('catch - put-message');
    res.status(500).json({ message: 'Что-то пошло не так ' });
  }
});

router.delete('/delete-message:id', verifyToken, async (req, res) => {
  try {
    await ChannelMessage.findByIdAndRemove(req.params.id);
    res
      .status(201)
      .json({ removedId: req.params.id, message: 'Сообщение удалено' });
  } catch (e) {
    console.log('catch - delete-message');
    res.status(500).json({ removed: false, message: 'Что-то пошло не так ' });
  }
});

async function checkAccesToChannel(chatId, userId) {
  const activeChannel = await Channel.findOne({ _id: chatId });

  return activeChannel.isPrivate && !activeChannel.members.includes(userId)
    ? true
    : false;
}

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  //console.log("token ", token)

  if (token == null) return res.sendStatus(401);

  jsonWebToken.verify(token, config.get('jwtSecret'), (err, success) => {
    err ? res.sendStatus(403) : next();
  });
}

module.exports = router;
