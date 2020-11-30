const { Router } = require("express");
const config = require("config");
const router = Router();
const jsonWebToken = require("jsonwebtoken");
const DirectMessage = require("../models/DirectMessage.js");

router.get("/get-direct-messages:userId", verifyToken, async (req, res) => {
  try {
    const directMessages = await DirectMessage.findOne({
      inviter: req.params.userId,
    });
    console.log("directMessages = > ", directMessages);
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
    let allDirectMessages;
    const existedDirectMessage = await DirectMessage.findOne({
      inviter: req.body.inviter,
    });

    if (existedDirectMessage) {
      existedDirectMessage.invited.push(...req.body.invitedUsers);
      allDirectMessages = await existedDirectMessage.save();
    } else {
      allDirectMessages = await DirectMessage.create({
        inviter: req.body.inviter,
        invited: req.body.invitedUsers,
      });
    }
    res.status(201).json({
      allDirectMessages,
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
