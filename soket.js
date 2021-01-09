const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });
//Надає унікальний код
const { v4 } = require('uuid');
let rooms = [];

//Підписуюсь на події, ця подія (connection) спрацює коли клієнт підключиться до сервера, другим об'єктом передається функція зворотнього виклику. Аргумент ws - назва параметру веб-сокет зєднання
server.on('connection', (ws) => {
  const uuid = v4(); // create here a uuid for this connection
  const ip = ws._socket.remoteAddress;

  const join = (userRooms, userId) => {
    userRooms.forEach((resRoomId) => {
      let roomsHasResRoom = false;
      rooms.forEach((chat, index) => {
        if (chat && chat.chatId === resRoomId) {
          const chatHasNewMember = Object.keys(chat.members).includes(userId);
          if (!chatHasNewMember) {
            rooms[index].members = rooms[index].members.concat({
              [userId]: ws,
            });
          }
          roomsHasResRoom = true;
        }
      });
      if (!rooms[0] || !roomsHasResRoom) {
        const newChat = { chatId: resRoomId, members: [{ [userId]: ws }] };
        rooms = rooms.concat(newChat);
      }
    });
  };

  function resOnline(userRooms) {
    const usersOnline = getRoomOnline(userRooms);
    informMembersNewOnline(userRooms, usersOnline);
  }

  function getRoomOnline(userRooms) {
    let usersOnline = [];
    rooms.forEach((room) => {
      if (userRooms.includes(room.chatId)) {
        room.members.forEach((member) => {
          const idMember = Object.keys(member)[0];
          const arrInclude = usersOnline.includes(idMember);
          if (!arrInclude) usersOnline = usersOnline.concat(idMember);
        });
      }
    });
    return usersOnline;
  }

  function informMembersNewOnline(userRooms, members) {
    rooms.forEach((room) => {
      if (userRooms.includes(room.chatId)) {
        room.members.forEach((member) => {
          Object.values(member)[0].send(
            JSON.stringify({ message: 'online', members })
          );
        });
      }
    });
  }

  const leave = (resRoom, userId) => {
    if (!rooms[0]) return;
    rooms.forEach((room, index) => {
      if (room.chatId === resRoom) {
        const membersId = Object.keys(room.members);
        if (membersId.length === 1 && membersId[0] === userId) {
          rooms.splice(index, 1);
        } else {
          rooms[index].members = room.members.filter((member) => {
            return Object.keys(member)[0] !== userId;
          });
        }
      }
    });
    rooms.forEach((room, index) => {
      if (room.members[0] === undefined) {
        rooms.splice(index, 1);
      }
    });
  };

  ws.on('message', (data) => {
    const parseData = JSON.parse(data);
    const { meta } = parseData;
    console.log('message ...');

    if (meta === 'join') {
      const { userRooms, userId } = parseData;
      join(userRooms, userId); // User has joined
      resOnline(userRooms);
    } else if (meta === 'leave') {
      console.log('leave \n\n\n leave');
      parseData.userRooms.forEach((resRoom) => {
        leave(resRoom, parseData.userId);
      });
      console.log(rooms);
    } else if (!meta) {
      rooms.forEach((room) => {
        if (room.chatId === parseData.room) {
          room.members.forEach((member) => {
            Object.values(member)[0].send(JSON.stringify(parseData.message));
          });
        }
      });
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
