const { Router } = require("express");
const config = require("config");
const router = Router();
const jsonWebToken = require("jsonwebtoken");
const DirectMessage = require("../models/DirectMessage.js");
const DirectMessageChat = require("../models/DirectMessageChat.js");

router.post("/post-message:activeChannelId", verifyToken, async (req, res) => {
  try {
    const newMessage = await DirectMessageChat.create(req.body);
    res.status(201).json({
      newMessage,
      message: "Повідомлення надіслано",
    });
  } catch (e) {
    res
      .status(500)
      .json({ message: "В DirectMessageChat что-то пошло не так -", error: e });
  }
});

function verifyToken(req, res, next) {
  const token = req.headers["authorization"];

  if (token == null) {
    return res.sendStatus(401);
  } else {
    jsonWebToken.verify(token, config.get("jwtSecret"), (err, success) => {
      if (err) {
        console.log(`error in verifyToken ${err}`);
        res.sendStatus(403);
      } else next();
    });
  }
}

module.exports = router;
