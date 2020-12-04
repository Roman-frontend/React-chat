const { Router } = require("express");
const config = require("config");
const router = Router();
const jsonWebToken = require("jsonwebtoken");
const DirectMessage = require("../models/DirectMessage.js");
const DirectMessageChat = require("../models/DirectMessageChat.js");

router.get("/get-messages:directMessageId", verifyToken, async (req, res) => {
  try {
    const messages = await DirectMessageChat.find({
      chatId: req.params.directMessageId,
    });
    res.status(201).json({
      messages,
      message: "Повідомлення повернено",
    });
  } catch (e) {
    res
      .status(500)
      .json({ message: "В DirectMessageChat что-то пошло не так -", error: e });
  }
});

router.post("/post-message:directMessageId", verifyToken, async (req, res) => {
  try {
    const newMessage = await DirectMessageChat.create(req.body);
    res.status(201).json({
      newMessage,
      message: "Повідомлення створено",
    });
  } catch (e) {
    res.status(500).json({
      message: "В postDirectMessageChat что-то пошло не так -",
      error: e,
    });
  }
});

router.delete("/delete-message:id", verifyToken, async (req, res) => {
  try {
    await DirectMessageChat.findByIdAndRemove(req.params.id);
    res
      .status(201)
      .json({ removedId: req.params.id, message: "Сообщение удалено" });
  } catch (e) {
    console.log("catch - delete-message");
    res.status(500).json({ removed: false, message: "Что-то пошло не так " });
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
