const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });
//Надає унікальний код
const { v4 } = require('uuid');
const rooms = {};
let chats = [];

//Підписуюсь на події, ця подія (connection) спрацює коли клієнт підключиться до сервера, другим об'єктом передається функція зворотнього виклику. Аргумент ws - назва параметру веб-сокет зєднання
server.on('connection', (ws) => {
  const uuid = v4(); // create here a uuid for this connection
  const ip = ws._socket.remoteAddress;

  const join = (userRooms, userId) => {
    userRooms.forEach((room) => {
      if (!rooms[room]) rooms[room] = []; // create room if room is not created
      const roomsHasUserData = rooms[room].filter(
        //Check is has room the joined user
        (user) => user[userId] === userId
      );
      if (!!!roomsHasUserData[0]) {
        //if room have not user - adding user to room
        rooms[room] = rooms[room].concat({ [userId]: { soketData: ws } });
      }
    });
  };

  const leave = (room, userId) => {
    if (!rooms[room]) return;
    if (Object.keys(rooms[room]).length === 1) delete rooms[room];
    else delete rooms[room][userId];
  };

  ws.on('message', (data) => {
    const parseData = JSON.parse(data);
    const { meta } = parseData;

    if (meta === 'join') {
      const { userRooms, userId } = parseData;
      join(userRooms, userId); // User has joined

      let onlineUserData = [];
      userRooms.forEach((room) => {
        if (rooms[room]) {
          Object.entries(rooms).forEach(([chatId, data]) => {
            if (chatId === room) {
              let members = [];
              data.forEach((memberData) => {
                Object.entries(memberData).forEach(([memberId, memberData]) => {
                  members = members.concat({
                    [memberId]: memberData.soketData,
                  });
                });
              });
              onlineUserData.push({ chatId, members });
            }
          });
        }
      });
      //Ready updates userData of online

      if (!chats[0]) {
        chats = onlineUserData;
      } else {
        onlineUserData.forEach((newChat) => {
          const chatsHasNewChatId = chats.filter((oldChat) => {
            oldChat.chatId === newChat.chatId;
          });
          if (!!chatsHasNewChatId) {
            chats.forEach((oldChat, index) => {
              newChat.members.forEach((memberObj) => {
                if (
                  !Object.keys(oldChat.members).includes(
                    Object.keys(memberObj)[0]
                  )
                ) {
                  const concatedChat = oldChat.members.concat(memberObj);
                  chats[index].members = concatedChat;
                }
              });
            });
          } else {
            chats.push(newChat);
          }
        });
      }

      chats.forEach((chat) => {
        if (userRooms.includes(chat.chatId)) {
          let onlineMembers = [];
          chat.members.forEach((id) => {
            const idMember = Object.keys(id)[0];
            const arrInclude = onlineMembers.includes(idMember);
            if (!arrInclude) {
              onlineMembers = onlineMembers.concat(idMember);
            }
          });
          const chatId = chat.chatId;
          chat.members.forEach((soket) => {
            Object.values(soket)[0].send(
              JSON.stringify({
                message: 'resOnlineMembers',
                data: { chatId, onlineMembers },
              })
            );
          });
        }
      });
    } else if (meta === 'leave') {
      console.log('leave \n\n\n leave');
      parseData.userRooms.forEach((room) => {
        leave(room, parseData.userId);
      });
    } else if (!meta) {
      const { message, room } = parseData;
      Object.entries(rooms[room]).forEach(([, sock]) =>
        sock.soketData.send(JSON.stringify(message))
      );
    } else if (meta === 'exit') {
      ws.on('close', () => {
        Object.keys(rooms).forEach((room) => leave(room));
      });
    }
  });

  //дозволить відправити повідомлення клієнту
  ws.send("З'єднання з WebSocket встановлено");
});

module.exports = server;
