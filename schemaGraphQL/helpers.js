const Channel = require('../models/Channel');

exports.nameNotLongEnough = 'name must be at least 3 characters';
exports.duplicateEmail = 'already taken';
exports.emailNotLongEnough = 'email must be at least 3 characters';
exports.passwordNotLongEnough = 'password must be at least 3 characters';
exports.invalidEmail = 'email must be a valid email';

exports.checkAccesToChannel = async (chatId, userId) => {
  const channel = await Channel.findById(chatId);
  return channel.isPrivate && !channel.members.includes(userId) ? true : false;
};

exports.infoError = (err) => {
  if (err) console.log(err);
  console.log('updated');
};

exports.formatYupError = (err) => {
  const errors = [];
  err.inner.forEach((e) => {
    errors.push({
      path: e.path,
      message: e.message,
    });
  });
  console.log(errors);
  return errors;
  /* return {
    errors: errors[0].message,
    name: 'errorName',
    email: 'errorEmail',
    password: 'errorPassword',
    id: 'null',
  }; */
};
