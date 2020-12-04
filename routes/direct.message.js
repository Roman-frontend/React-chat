const { Router } = require("express");
const config = require("config");
const router = Router();
const jsonWebToken = require("jsonwebtoken");
const DirectMessage = require("../models/DirectMessage.js");
const User = require("../models/User.js");

router.post("/get-direct-messages", verifyToken, async (req, res) => {
  try {
    let directMessages = [];
    for (let directMessageId of req.body.listDirectMessages) {
      const directMessage = await DirectMessage.findById(directMessageId);
      if (directMessage) {
        directMessages.push(directMessage);
      }
    }
    res.json({ directMessages, message: "direct messages responsed" });
  } catch (e) {
    console.log("failed in directMessages", e);
    res
      .status(500)
      .json({ message: "Помилка при виконанні get-запиті ", error: e });
  }
});

router.post("/post-direct-messages", async (req, res) => {
  try {
    let allNewDirectMessage = [];

    for (let user of req.body.invitedUsers) {
      const newDirectMessage = await DirectMessage.create({
        inviter: req.body.inviter,
        invited: user,
      });

      const inviterDbData = await User.findById(req.body.inviter._id);
      inviterDbData.directMessages.push(newDirectMessage._id);
      await inviterDbData.save();

      const invitedDbData = await User.findById(user._id);
      invitedDbData.directMessages.push(newDirectMessage._id);
      await invitedDbData.save();

      allNewDirectMessage.push(newDirectMessage);
    }

    res.status(201).json({
      allNewDirectMessage,
      message: "Direct Messages created",
    });
  } catch (e) {
    console.log("catch - post-direct-messages ===>>> ", e);
    res.status(500).json({ message: "Помилка в post-direct-messages" });
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
