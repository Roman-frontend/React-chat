const Channel = require('../models/Channel');

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

  console.log({
    errors: errors[0].message,
    name: 'errorName',
    email: 'errorEmail',
    password: 'errorPassword',
  });
  return JSON.stringify({
    errors: errors[0].message,
    name: 'errorName',
    email: 'errorEmail',
    password: 'errorPassword',
  });
};
