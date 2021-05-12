const Channel = require('../models/Channel');
const jsonWebToken = require('jsonwebtoken');
const config = require('config');

exports.verifyToken = (token) => {
  if (!token) {
    return false;
  }
  const result = jsonWebToken.verify(
    token,
    config.get('jwtSecret'),
    (err, success) => {
      return err ? false : true;
    }
  );
  console.log('result verify token', result);
  return result;
};

exports.checkAccesToChannel = async (chatId, userId) => {
  const channel = await Channel.findById(chatId);
  return channel.isPrivate && !channel.members.includes(userId) ? true : false;
};

exports.infoError = (err) => {
  if (err) console.log(err);
  console.log('updated');
  return true;
};

exports.formatYupError = (err) => {
  const errors = [];
  err.inner.forEach((e) => {
    errors.push({
      path: e.path,
      message: e.message,
    });
  });
  return JSON.stringify({
    errors: errors[0].message,
    name: 'errorName',
    email: 'errorEmail',
    password: 'errorPassword',
  });
};
