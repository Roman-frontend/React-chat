// Тут описано бізнес-логіку (Service)
const yup = require("yup");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../models/User");
const { formatYupError } = require("../graphql/helpers.js");
const {
  nameNotLongEnough,
  emailNotLongEnough,
  invalidEmail,
  passwordNotLongEnough,
} = require("../common/errors.js");

const schema = yup.object().shape({
  name: yup.string().min(3, nameNotLongEnough).max(255),
  email: yup.string().min(5, emailNotLongEnough).max(255).email(invalidEmail),
  password: yup.string().min(3, passwordNotLongEnough).max(255),
});

async function checkReq(args) {
  try {
    await schema.validate(args, { abortEarly: false });
    return { status: 200 };
  } catch (err) {
    const error = formatYupError(err);
    return { status: 400, error };
  }
}

class AuthService {
  async getUser(args) {
    const checkedReq = await checkReq(args);
    if (checkedReq.status !== 200) return checkedReq;

    const { email, password } = args;
    const user = await User.findOne({ email });
    if (!user) return { status: 401 };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return { status: 500 };

    const token = jwt.sign(
      { userId: user.id },
      config.get("jwtSecret")
      //{ expiresIn: '1h'}
    );

    return { status: 200, user, token };
  }

  async registerUser(args) {
    const checkedReq = await checkReq(args);
    if (checkedReq.status !== 200) {
      return checkedReq;
    }

    const { name, email, password } = args;
    const emailIsBasy = await User.findOne({ email });
    if (emailIsBasy) {
      return { status: 403 };
    }
    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
    });
    //const newUser = await User.findOne({ email: 'r@mail.ru' });
    const token = jwt.sign(
      { userId: newUser.id },
      config.get("jwtSecret")
      //{ expiresIn: '1h'}
    );
    return { status: 200, user: newUser, token };
  }
}

module.exports = new AuthService();
