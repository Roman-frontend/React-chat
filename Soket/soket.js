// Замість того щоб з кожним повідомленням відправляти назву чату, коли юзер переключає чат відправляти запит на бекенд аби коли відправлятимуться повідомлення, на бекенді було вказано в якому це чаті.

const WebSocket = require("ws");
const server = new WebSocket.Server({ port: 8080 });
//Надає унікальний код
const { v4 } = require("uuid");
let rooms = [];
let onlineUsers = [];

//Підписуюсь на події, ця подія (connection) спрацює коли клієнт підключиться до сервера, другим об'єктом передається функція зворотнього виклику. Аргумент ws - назва параметру веб-сокет зєднання
server.on("connection", (ws) => {
  const uuid = v4(); // create here a uuid for this connection
  const ip = ws._socket.remoteAddress;

  ws.on("message", (data) => {
    const parseData = JSON.parse(data);
    const { meta } = parseData;

    if (meta === "join") {
      const { userRooms, userId, clientId } = parseData;
      joinToRooms(userRooms, userId, ws, uuid); // User has joined
      joinToUsers(userId, ws, uuid);
      console.log("userId: ", userId);
      resOnline(userRooms);
    }

    if (meta === "leave") {
      console.log("meta === leave");
      parseData.userRooms.forEach((resRoom) => {
        leave(resRoom, parseData.userId);
      });
      resOnline(parseData.userRooms);
    }

    if (meta === "sendMessage") {
      rooms.forEach((room) => {
        if (room.chatId === parseData.room) {
          room.members.forEach((member) => {
            if (member.roomId !== uuid) {
              Object.values(member)[0].send(JSON.stringify(parseData.message));
            }
          });
        }
      });
    }

    if (meta === "addedDm") {
      addNewDmToRooms(parseData.dmId, parseData.userId, ws, uuid);
      const invitedWs = onlineUsers.find((user) => {
        return Object.keys(user)[0] === parseData.invitedId;
      });
      if (invitedWs) {
        invitedWs[parseData.invitedId].send(
          JSON.stringify({ message: "added dm", id: parseData.dmId })
        );
      }
    }

    if (meta === "removedDm") {
      rooms = rooms.filter((room) => room.chatId !== parseData.dmId);
      const invitedWs = onlineUsers.find((user) => {
        return Object.keys(user)[0] === parseData.removedUserId;
      });
      if (invitedWs) {
        invitedWs[parseData.removedUserId].send(
          JSON.stringify({ message: "removed dm", id: parseData.dmId })
        );
      }
    }

    if (meta === "exit") {
      ws.on("close", () => {
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

function createNewRoom(resRoomId, userId, ws, roomId) {
  const newChat = {
    chatId: resRoomId,
    members: [{ [userId]: ws, roomId }],
  };
  rooms = rooms.concat(newChat);
}

function addMemberToRoom(index, chat, userId, ws, roomId) {
  let chatHasMember = undefined;
  const f = chat.members.forEach((member, index) => {
    if (Object.keys(member)[0] === userId) {
      // console.log("member are is in room", Object.keys(member)[0], userId);
      chatHasMember = index;
    }
  });

  if (typeof chatHasMember === "undefined") {
    // Add user to chat
    rooms[index].members = rooms[index].members.concat({
      [userId]: ws,
      roomId,
    });
  } else {
    rooms[index].members[chatHasMember] = {
      [userId]: ws,
      roomId,
    };
  }
}

function joinToRooms(userRooms, userId, ws, roomId) {
  // console.log("userRooms: ", userRooms, "userId: ", userId, "roomId: ", roomId);
  if (!rooms[0]) {
    userRooms.forEach((resRoomId) => {
      createNewRoom(resRoomId, userId, ws, roomId);
    });
    return;
  } else {
    userRooms.forEach((resRoomId) => {
      let isNotFoundChat = true;
      rooms.forEach((chat, index) => {
        if (chat?.chatId === resRoomId) {
          isNotFoundChat = false;
          addMemberToRoom(index, chat, userId, ws, roomId);
        }
      });
      if (isNotFoundChat) {
        // console.log("isNotFoundChat: ", resRoomId, "userRooms: ", userRooms, "rooms: ", rooms );
        createNewRoom(resRoomId, userId, ws, roomId);
      }
    });
  }
  // console.log(rooms);
}

function joinToUsers(userId, ws, uuid) {
  const newOnline = { [userId]: ws, uniqueIdForAPI: uuid };
  let onlineUsersHasNotUserId = true;
  onlineUsers.forEach((user, index) => {
    if (Object.keys(user)[0] === userId) {
      onlineUsersHasNotUserId = false;
      onlineUsers[index] = newOnline;
    }
  });

  if (onlineUsersHasNotUserId) {
    onlineUsers = onlineUsers.concat(newOnline);
  }

  // console.log("onlineUsers: ", onlineUsers);
}

function addNewDmToRooms(dmId, userId, ws, roomId) {
  const newChat = {
    chatId: dmId,
    members: [{ [userId]: ws, roomId }],
  };
  rooms = rooms.concat(newChat);
}

function resOnline(userRooms) {
  const arrIdOnline = getRoomOnline(userRooms);
  informMembersNewOnline(userRooms, arrIdOnline);
}

function getRoomOnline(userRooms) {
  let arrOfOnlineUsersId = [];
  // console.log("rooms: ", rooms);
  // Серед усіх кімнат шукаю кімнати юзера
  rooms.forEach((room) => {
    // console.log("room: ", room);
    if (userRooms.includes(room.chatId) && room.members[0]) {
      // Cкладаю список учасників кімнат юзера кому треба повідомити що юзер онлайн, або вийшов з онлайну
      room.members.forEach((member) => {
        const idMember = Object.keys(member)[0];
        // console.log("idMember: ", idMember);
        const arrInclude = arrOfOnlineUsersId.includes(idMember);
        console.log(idMember, arrOfOnlineUsersId);
        if (!arrInclude)
          arrOfOnlineUsersId = arrOfOnlineUsersId.concat(idMember);
      });
    }
  });
  // console.log("arrOfOnlineUsersId: ", arrOfOnlineUsersId);
  return arrOfOnlineUsersId;
}

function informMembersNewOnline(userRooms, members) {
  let responsed = [];
  rooms.forEach((room) => {
    if (userRooms.includes(room.chatId)) {
      room.members.forEach((member) => {
        const memberId = Object.keys(member)[0];

        if (!responsed.includes(memberId)) {
          Object.values(member)[0].send(
            JSON.stringify({ message: "online", members })
          );
          responsed = responsed.concat(memberId);
        }
      });
    }
  });
}

function leave(resRoom, userId) {
  console.log("leave... ");
  if (onlineUsers[0]) {
    onlineUsers = onlineUsers.filter((user) => {
      return Object.keys(user)[0] !== userId;
    });
  }
  if (rooms[0]) {
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
}

module.exports = server;
