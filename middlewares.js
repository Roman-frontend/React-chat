const { verify } = require('jsonwebtoken');
const config = require('config');

exports.verifyToken = (token) => {
  let result = null;
  verify(token, config.get('jwtSecret'), (err, success) => {
    if (success) {
      result = { isAuth: token, userId: success.userId };
    }
  });
  return result;
};
