// Тут описано бізнес-логіку (Service)
const nodemailer = require("nodemailer");
const DirectMessage = require("../models/DirectMessage.js");
const DirectMessageChat = require("../models/DirectMessageChat.js");
const User = require("../models/User.js");
const { checkAccesToChannel, infoError } = require("../graphql/helpers");

class DMService {
  async getDirectMessages({ id }) {
    let allFinded = [];
    //Можна створити валідатор який перевіряє чи це юзер має доступ до цих повідомлень ждя цього сюди треба передати ід юзера, знайти його модель в ДБ і через інклудес перевірити і якщо перевірку проходить то тоді продовжити.
    for (let directMessageId of id) {
      const finded = await DirectMessage.findById(directMessageId);
      if (finded) {
        allFinded.push(finded);
      }
    }
    return { status: 200, directMessages: allFinded };
  }

  sendToGmail({ from, to, subject, text }) {
    const mailOptions = { from, to, subject, text };
    let sendError = null;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    transporter.sendMail(mailOptions, (error) => {
      if (error) sendError = error;
    });
    if (sendError) {
      return {
        status: 500,
        message: `Message fail sended to gmail... ${sendError}`,
      };
    } else {
      return {
        status: 200,
        message: `Message sended to gmail...`,
      };
    }
  }

  async createDM({ inviter, invited }) {
    let allNew = [];
    let alreadyInviteds = [];
    for (let invitedId of invited) {
      const sortedMembers = [inviter, invitedId].sort();
      const userHasChat = await DirectMessage.exists({
        members: sortedMembers,
      });
      if (userHasChat || inviter === invitedId) {
        const alreadyInvited = await User.findById(invitedId);
        alreadyInviteds.push(alreadyInvited.email);
        continue;
      }
      const dbInviter = await User.findById(inviter);
      const dbInvited = await User.findById(invitedId);
      const newDrMsg = await DirectMessage.create({ members: sortedMembers });

      dbInviter.directMessages.push(newDrMsg.id);
      await dbInviter.save();

      dbInvited.directMessages.push(newDrMsg.id);
      await dbInvited.save();

      allNew = allNew.concat(newDrMsg);
    }
    const message = alreadyInviteds[1]
      ? `Users ${alreadyInviteds.join(", ")} already invited`
      : alreadyInviteds[0]
      ? `User ${alreadyInviteds.join(", ")} already invited`
      : "This is a success invite!";
    const directMessagesId = allNew.map((drMsg) => drMsg.id);
    const status =
      alreadyInviteds.length === invited.length
        ? 420
        : alreadyInviteds[0]
        ? 419
        : 200;

    return { status, directMessagesId, directMessages: allNew, message };
  }

  async removeDM({ id }) {
    const removed = await DirectMessage.findByIdAndRemove(
      { _id: id },
      { useFindAndModify: false, new: true }
    );
    const inviter = await User.findById(removed.members[0]);
    const updaterInvited = inviter.directMessages.filter(
      (drMsg) => drMsg != id
    );
    await User.findOneAndUpdate(
      { _id: removed.members[0] },
      { directMessages: updaterInvited },
      { useFindAndModify: false, new: true },
      (err) => err && infoError(err)
    );

    const invited = await User.findById(removed.members[1]);
    const updatedInvited = invited.directMessages.filter(
      (drMsg) => drMsg != id
    );
    await User.findOneAndUpdate(
      { _id: removed.members[1] },
      { directMessages: updatedInvited },
      { useFindAndModify: false, new: true },
      (err) => err && infoError(err)
    );
    await DirectMessageChat.deleteMany({ chatId: id });
    return { status: 200, id, members: removed.members };
  }
}

module.exports = new DMService();
