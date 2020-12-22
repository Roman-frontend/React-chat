const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });
//Надає унікальний код
const { v4 } = require('uuid');
const rooms = {};

//Підписуюсь на події, ця подія (connection) спрацює коли клієнт підключиться до сервера, другим об'єктом передається функція зворотнього виклику. Аргумент ws - назва параметру веб-сокет зєднання
server.on('connection', (ws) => {
  const uuid = v4(); // create here a uuid for this connection

  const leave = (room) => {
    if (!rooms[room]) {
      return;
    }
    if (Object.keys(rooms[room]).length === 1) delete rooms[room];
    else delete rooms[room][uuid];
  };

  ws.on('message', (data) => {
    const parseData = JSON.parse(data);
    const { message, meta, room } = parseData;

    console.log('uuid => ', uuid, data, 'myRoom => ', rooms[room]);
    if (meta === 'join') {
      if (!rooms[room]) rooms[room] = {}; // create the room
      if (!rooms[room][uuid]) rooms[room][uuid] = ws; // join the room
      console.log('meta -->> ', meta, 'newRoom -> ', rooms[room]);
    } else if (meta === 'leave') {
      leave(room);
    } else if (!meta) {
      // send the message to all in the room
      //Object.entries(rooms[room]) - поверне масив об'єктів з масиву rooms[room]
      console.log('rooms ->> ', rooms, 'message -->> ', message);
      Object.entries(rooms[room]).forEach(([, sock]) =>
        sock.send(JSON.stringify(message))
      );
    } else if (meta === 'exit') {
      console.log('exitRoom');
      ws.on('close', () => {
        // for each room, remove the closed socket
        Object.keys(rooms).forEach((room) => leave(room));
      });
    }
  });

  //дозволить відправити повідомлення клієнту
  ws.send("З'єднання з WebSocket встановлено");
});

module.exports = server;
