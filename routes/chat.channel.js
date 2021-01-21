const { Router } = require('express');
const config = require('config');
const Channel = require('../models/Channel.js');
const User = require('../models/User.js');
const router = Router();
const jsonWebToken = require('jsonwebtoken');

//Coming from SetUser
router.get(`/get-users:userId`, verifyToken, async (req, res) => {
  try {
    const users = await User.find({});
    res.json({ users, message: 'Users responsed' });
  } catch (e) {
    //console.log('failed in get-users')
    res
      .status(500)
      .json({ message: 'Помилка при виконанні get-запиті ', error: e });
  }
});

router.get(`/get-user`, async (req, res) => {
  try {
    const users = await User.find({});
    res.json({ users, message: 'Users responsed' });
  } catch (e) {
    res
      .status(500)
      .json({ message: 'Помилка при виконанні get-запиті ', error: e });
  }
});

router.post('/post-channel:userId', verifyToken, async (req, res) => {
  try {
    const newChannel = await Channel.create(req.body);
    for (let memberId of req.body.members) {
      const user = await User.findById(memberId);
      user.channels.push(newChannel._id);
      await user.save();
    }

    //const updatedUserData = await User.findById(req.params.userId);

    res.status(201).json({ newChannel, message: 'Канал створено' });
  } catch (e) {
    console.log('failed after post channel ', e);
    res.status(500).json({ message: 'Что-то пошло не так -', error: e });
  }
});

console.log('chat.channel файл');

router.post(
  '/post-add-members-to-channel:activeChannelId',
  verifyToken,
  async (req, res) => {
    try {
      for await (const userId of req.body.invitedUsers) {
        const addedUser = await User.findById(userId);
        addedUser.channels.push(req.params.activeChannelId);
        await addedUser.save();

        const activeChannel = await Channel.findById(
          req.params.activeChannelId
        );
        activeChannel.members.push(userId);
        await activeChannel.save();
      }
      const updatedChannel = await Channel.findById(req.params.activeChannelId);

      res.status(201).json({
        userChannels: updatedChannel,
        message: 'Учасника додано',
      });
    } catch (e) {
      console.log('Учасника не додано бо: ', e);
      res.status(500).json({ message: 'Что-то пошло не так -', error: e });
    }
  }
);

//Coming from Channels,
router.post('/get-chunnels', verifyToken, async (req, res) => {
  try {
    let userChannels = [];
    for (const chatId of req.body) {
      const channel = await Channel.find({ _id: chatId });
      userChannels = userChannels.concat(channel);
    }
    res.json({ userChannels, message: 'Channels responsed' });
  } catch (e) {
    console.log('failed in get-channels');
    res
      .status(500)
      .json({ message: 'Помилка при виконанні get-запиті ', error: e });
  }
});

router.delete('/delete-channel:id', verifyToken, async (req, res) => {
  try {
    function infoError(err) {
      if (err) console.log(err);
      console.log('updated');
    }
    if (req.body.filteredChannelMembers[0]) {
      await Channel.findOneAndUpdate(
        { _id: req.params.id },
        { members: req.body.filteredChannelMembers },
        { useFindAndModify: false, new: true },
        (err) => infoError(err)
      );
    } else {
      await Channel.findByIdAndRemove(
        req.params.id,
        { useFindAndModify: false },
        (err) => infoError(err)
      );
    }

    await User.findByIdAndUpdate(
      { _id: req.body.userId },
      { channels: req.body.filteredUserChannels },
      { useFindAndModify: false, new: true },
      (err) => infoError(err)
    );

    const resBody = {
      removedChannelId: req.params.id,
      message: 'Канал видалено',
    };
    res.status(201).json({ ...resBody });
  } catch (e) {
    console.log('catch - delete-channel ===>>> ', e);
    res.status(500).json({ message: 'Помилка в delete-channel' });
  }
});

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (token == null) {
    console.log(`помилка при перевірці token`);
    return res.sendStatus(401);
  } else {
    jsonWebToken.verify(token, config.get('jwtSecret'), (err, success) => {
      if (err) {
        console.log(`error in verifyToken ${err}`);
        res.sendStatus(403);
      } else next();
    });
  }
}

module.exports = router;
