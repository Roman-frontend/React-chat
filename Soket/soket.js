const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });
//Надає унікальний код
const { v4 } = require('uuid');
let rooms = [];

//Підписуюсь на події, ця подія (connection) спрацює коли клієнт підключиться до сервера, другим об'єктом передається функція зворотнього виклику. Аргумент ws - назва параметру веб-сокет зєднання
server.on('connection', (ws) => {
  const uuid = v4(); // create here a uuid for this connection
  const ip = ws._socket.remoteAddress;

  ws.on('message', (data) => {
    const parseData = JSON.parse(data);
    const { meta } = parseData;

    if (meta === 'join') {
      const { userRooms, userId } = parseData;
      join(userRooms, userId, ws, uuid); // User has joined
      resOnline(userRooms);
    } else if (meta === 'leave') {
      console.log('leave \n\n leave path -->>', parseData);
      parseData.userRooms.forEach((resRoom) => {
        leave(resRoom, parseData.userId);
      });
      resOnline(parseData.userRooms);
    } else if (meta === 'sendMessage') {
      rooms.forEach((room) => {
        if (room.chatId === parseData.room) {
          room.members.forEach((member) => {
            if (member.roomId !== uuid) {
              Object.values(member)[0].send(JSON.stringify(parseData.message));
            }
          });
        }
      });
    } else if (meta === 'exit') {
      ws.on('close', () => {
        Object.keys(rooms).forEach((room) => leave(room));
      });
    }
  });

  ws.send(
    JSON.stringify({
      message: "З'єднання з WebSocket встановлено",
    })
  );
});

function join(userRooms, userId, ws, roomId) {
  userRooms.forEach((resRoomId) => {
    let roomsHasResRoom = false;
    rooms.forEach((chat, index) => {
      if (chat && chat.chatId === resRoomId) {
        const chatHasNewMember = Object.keys(chat.members).includes(userId);
        if (!chatHasNewMember) {
          rooms[index].members = rooms[index].members.concat({
            [userId]: ws,
            roomId,
          });
        }
        roomsHasResRoom = true;
      }
    });
    if (!rooms[0] || !roomsHasResRoom) {
      const newChat = {
        chatId: resRoomId,
        members: [{ [userId]: ws, roomId }],
      };
      rooms = rooms.concat(newChat);
    }
  });
}

function resOnline(userRooms) {
  const arrIdOnline = getRoomOnline(userRooms);
  informMembersNewOnline(userRooms, arrIdOnline);
}

function getRoomOnline(userRooms) {
  let arrOfOnlineUsersId = [];
  rooms.forEach((room) => {
    if (userRooms.includes(room.chatId) && room.members[0]) {
      room.members.forEach((member) => {
        const idMember = Object.keys(member)[0];
        const arrInclude = arrOfOnlineUsersId.includes(idMember);
        if (!arrInclude)
          arrOfOnlineUsersId = arrOfOnlineUsersId.concat(idMember);
      });
    }
  });
  //console.log('arrOfOnlineUsersId --->', arrOfOnlineUsersId);
  return arrOfOnlineUsersId;
}

function informMembersNewOnline(userRooms, members) {
  let responsed = [];
  //console.log(rooms[0].members, userRooms);
  rooms.forEach((room) => {
    if (userRooms.includes(room.chatId)) {
      //console.log(room.members);
      room.members.forEach((member) => {
        const memberId = Object.keys(member)[0];

        if (!responsed.includes(memberId)) {
          //console.log('memberData -> ', Object.values(member)[0]);
          Object.values(member)[0].send(
            JSON.stringify({ message: 'online', members })
          );
          responsed = responsed.concat(memberId);
        }
      });
    }
  });
}

function leave(resRoom, userId) {
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
}

module.exports = server;
