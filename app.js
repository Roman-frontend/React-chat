const express = require("express");
const path = require("path");
const config = require("config");
const mongoose = require("mongoose");
const app = express();
const WebSocket = require("ws");
const server = new WebSocket.Server({ port: 8080 });
//Надає унікальний код
const { v4 } = require("uuid");
const rooms = {};

//дозволить коректно парсити body який приходить з фронтента бо по замовчуванні node js сприймає body як
//стріми(потік даних) - тобто як дані з фротента що передаються частинами що не дозволить прочитати їх
app.use(express.json({ extended: true }));

//Підписуюсь на події, ця подія (connection) спрацює коли клієнт підключиться до сервера, другим об'єктом передається функція зворотнього виклику. Аргумент ws - назва параметру веб-сокет зєднання
server.on("connection", (ws) => {
  const uuid = v4(); // create here a uuid for this connection

  const leave = (room) => {
    // not present: do nothing
    if (!rooms[room]) {
      return;
    }

    // if the one exiting is the last one, destroy the room
    if (Object.keys(rooms[room]).length === 1) delete rooms[room];
    // otherwise simply leave the room
    else delete rooms[room][uuid];
  };

  ws.on("message", (data) => {
    const parseData = JSON.parse(data);
    const { message, meta, room } = parseData;

    console.log("uuid => ", uuid, data);
    if (meta === "join") {
      if (!rooms[room]) rooms[room] = {}; // create the room
      if (!rooms[room][uuid]) rooms[room][uuid] = ws; // join the room
    } else if (meta === "leave") {
      leave(room);
    } else if (!meta) {
      // send the message to all in the room
      //console.log("room ======>>>>>>>  ", rooms[room]);
      Object.entries(rooms[room]).forEach(([, sock]) =>
        sock.send(JSON.stringify(message))
      );
    } else if (meta === "exit") {
      ws.on("close", () => {
        // for each room, remove the closed socket
        Object.keys(rooms).forEach((room) => leave(room));
      });
    }
  });

  //дозволить відправити повідомлення клієнту
  ws.send("З'єднання з WebSocket встановлено");
});

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/chat", require("./routes/chat.message"));
app.use("/api/channel", require("./routes/chat.channel"));
app.use("/api/direct-message", require("./routes/direct.message"));
app.use("/api/direct-message-chat", require("./routes/direct.message.chat"));

app.use(express.static(path.resolve(__dirname, "client", "src", "components")));

app.get("*", (req, res) => {
  console.log("Запит за неоприділеним URL", req.path);
  res
    .status(200)
    .sendFile(path.resolve(__dirname, "client", "public", "index.html"));
});

const PORT = config.get("port") || 5000;

async function start() {
  try {
    await mongoose.connect(config.get("mongoUri"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("mongoose conected");
    app.listen(PORT, () =>
      console.log(`Server has been started on port ${PORT}...`)
    );
  } catch (e) {
    console.log("Чтото пошло не так ", e.message);
    process.exit(1);
  }
}

start();
