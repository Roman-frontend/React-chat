const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });
//Надає унікальний код
const { v4 } = require('uuid');
const rooms = {};

//Підписуюсь на події, ця подія (connection) спрацює коли клієнт підключиться до сервера, другим об'єктом передається функція зворотнього виклику. Аргумент ws - назва параметру веб-сокет зєднання
server.on('connection', (ws) => {
  const uuid = v4(); // create here a uuid for this connection
  const ip = ws._socket.remoteAddress;

  const leave = (room, userId) => {
    if (!rooms[room]) {
      return;
    }
    if (Object.keys(rooms[room]).length === 1) delete rooms[room];
    else delete rooms[room][userId];
  };

  ws.on('message', (data) => {
    const parseData = JSON.parse(data);
    const { meta } = parseData;

    if (meta === 'join') {
      const { userRooms, userId } = parseData;
      //console.log('startRooma ===-', rooms);
      userRooms.forEach((room) => {
        if (!rooms[room]) rooms[room] = {}; // create the room
        if (!rooms[room][userId]) {
          rooms[room][userId] = { soketData: ws, userId }; // join the room
        }
        if (rooms[room]) {
          let onlineMembers = [];
          let a;
          //беру id юзера
          Object.entries(rooms).forEach(
            ([member, data]) => (a = Object.keys(data)[0])
          );
          Object.entries(rooms).forEach(([member, data]) =>
            onlineMembers.push(data)
          );
          //console.log(onlineMembers);
          onlineMembers.forEach((roomArr) => {
            //console.log(roomArr, a);
            Object.entries(roomArr).forEach(([roomObj, roomSock]) => {
              console.log(roomSock.userId);
              roomSock.soketData.send(
                JSON.stringify({
                  message: 'resChatMembers',
                  onlineMembers: roomSock.userId,
                })
              );
            });
          });
        }
      });
    } else if (meta === 'visit') {
      const { room } = parseData;

      let onlineMembers = [];
      if (!(Object.keys(rooms).length === 0)) {
        //console.log('rooms -->> ', rooms);
        Object.entries(rooms[room]).forEach(([member]) =>
          onlineMembers.push(member)
        );
      }
      ws.send(JSON.stringify({ message: 'resChatMembers', onlineMembers }));
    } else if (meta === 'leave') {
      parseData.userRooms.forEach((room) => {
        leave(room, parseData.userId);
      });
    } else if (!meta) {
      const { message, room } = parseData;
      //Object.entries(rooms[room]) - поверне масив об'єктів з масиву rooms[room]
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
