const {Router} = require('express')
const config = require('config')
const Message = require('../models/Message.js')
const User = require('../models/User.js')
const router = Router()


const createMessage = function(message) {
  return Message.create(message).then(mes => {
    console.log("\n>> Created Tutorial:\n", mes);
    return mes;
  });
};

/*const createMessage = function(userId, message) {
  console.log("\n>> Add message:\n", message._id, userId);
  return User.findByIdAndUpdate(
    userId,
    { $push: { message: message._id} },
    { new: true, useFindAndModify: false }
  );
};*/

/*const createMessage = async function(message) {
  const {username, text, createdAt, _id, reply} = message 
  const mes = new Message({username: username, text: text, reply: reply, createdAt: createdAt})
  await mes.save(function (err) {
    if (err) return console.log(err)
  })
  return mes
}*/
/*  return Message.create(message).then(mes => {
    console.log("\n>> Created Message:\n", mes);
    return mes;
  });
};
*/
const addMessageToUser = function(userId, message) {
  console.log('userId - ', userId)
   return User.findByIdAndUpdate(
    userId,
    { $push: { message: message._id } },
    { new: true, useFindAndModify: false }
  );
};

/*const addUserToMessage = function(messageId, user) {
  return db.Tutorial.findByIdAndUpdate(
    tutorialId,
    { $push: { tags: tag._id } },
    { new: true, useFindAndModify: false }
  );
};*/

/*router.get(`/get-messages:_id`, async (req, res) => {
  try {
    const user = await User.find({'_id': req.params._id})
    const messages = user[0].message
    console.log('user[0].message', user[0].message)
    res.json({messages, message : 'Повідомлення повернені'})
  } catch (e) {
    res.status(500).json({message: "Что-то пошло не так "})
  }
})*/

router.post(
  '/post-message:_id', [],
  async (req, res) => {
  try {
    const createdMessage = await createMessage(req.body)
    console.log('createdMessage - ', createdMessage)
    const addingMessageToUser = await addMessageToUser(req.params._id, createdMessage)
  } catch (e) {
  	res.status(500).json({message: "Что-то пошло не так "})
  }
})

router.put(
  '/put-message:_id', 
  async (req, res) => {
  try {
    await Message.findByIdAndUpdate(req.params._id, req.body)
    const messages = await Message.find({'username': 'Yulia'})
    res.status(201).json({messages, message : 'Повідомлення змінене'})
  } catch (e) {
    console.log("catch - put-message")
    res.status(500).json({message: "Что-то пошло не так "})
  }
})



router.delete(
  '/delete-message:_id/message:messageId', 
  async (req, res) => {
  try {
    let messageForRemove
    const user = await User.findOne({'_id': req.params._id})
    console.log('user-for-delete - ', user)
    //console.log('req.body  - ', user)
    //const msg = user.message.forEach((i, index) => {
    //  if (i._id === +req.params.messageId) { console.log("the-> ", i); messageForRemove = index}
    //})
    console.log('user-for-delete - ', user.message[messageForRemove])
    //await User.findOneAndRemove({"message": user.message[messageForRemove]})
    console.log('user-for-delete - ', messageForDelete)

    res.status(201).json({message : 'Сообщение удалено'})
  } catch (e) {
    console.log("catch - delete-message")
    res.status(500).json({message: "Что-то пошло не так "})
  }
})

module.exports = router;


































/*    const {username, text, createdAt, id, reply} = req.body 
    const message = new Message({username: username, text: text, reply: reply, createdAt: createdAt})
    await message.save(function (err) {
      if (err) return console.log(err)
    })

    const messages = await Message.find({'username': message.username})
    res.status(201).json({messages, message : 'Сообщение создано'})*/