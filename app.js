const path = require('path');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const config = require('config');
const mongoose = require('mongoose');
const typeDefs = require('./graphql/types/index');
const resolvers = require('./graphql/resolvers/index');
const { verifyToken } = require('./middlewares');
const cors = require('cors');
const socketIo = require('socket.io');
const { version, validate } = require('uuid');
require('./Soket/soket');

const ACTIONS = require('./client/src/socket.io/actions'); //Містить всі можливі ACTIONS з якими ми працюватимо як на сервері так і на клієнті

(async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      if (
        req.body.operationName !== 'Login' &&
        req.body.operationName !== 'Register'
      ) {
        return verifyToken(req.headers.authorization);
      }
    },
  });
  await server.start();

  const app = express();
  app.use(cors());

  server.applyMiddleware({ app });

  const io = socketIo(server);

  function getClientRooms() {
    //Повертає список всіх кімнат які існують
    const { rooms } = io.sockets.adapter; //Звідси отримуємо список кімнат що існують

    return Array.from(rooms.keys()).filter(
      //Фільтрує і повертає лише ті кімнати які створенні з ід що є результатом uuid v4
      //Оскільки rooms це map - то прописавши Array.from(rooms.keys()) - отримуємо ключі у вигляді масиву
      (roomID) => validate(roomID) && version(roomID) === 4 //По дефолту наш сокет підключений до кімнати з унікальною ід і створюється кімната на цей ід, тому треба перевіряти щоб це був ід uuid v4 а не внутрішній ід веб сокету, щоб в якійсь ситуації не підключитись не до тієї кімнати. Тобто щоб не міг підключитись до сокету який ще не створив кімнату, а натомість підключився до кімнати яку створив сокет іо. тому тут ми фильтруємо кімнати і пропускаємо лище ті що співпадають з версією і яка валідна
    );
  }

  function shareRoomsInfo() {
    //Завдяки цьому при воді на сторінку користувач буде отримувати список всіх доступних кімнат щоб він міг в будь яку підключитись
    io.emit(ACTIONS.SHARE_ROOMS, {
      //Так ми всім абсолютно сокетам відправляти коли у нас додаватиметься нова кімната аби всі клієнти взнали про неї. ACTIONS.SHARE_ROOMS - назва event,
      rooms: getClientRooms(),
    });
  }

  io.on('connection', (socket) => {
    shareRoomsInfo(); // Так при підключенні ділимось з усіма сокетами інформацією про кімнати

    socket.on(ACTIONS.JOIN, (config) => {
      //Буде виконуватись коли користувач буде приєднуватись до кімнат
      const { room: roomID } = config;
      const { rooms: joinedRooms } = socket; //Дивимось на всі кімнати які в нас є аби ми вдруг вдруге не підключились до однієї і тої самої кімнати. Тобто так ми дивимось на ті кімнати в яких уже є сокет.

      if (Array.from(joinedRooms).includes(roomID)) {
        //Перевірка чи користувач ще не підключений до цієї кімнати
        return console.warn(`Already joined to ${roomID}`);
      }

      const clients = Array.from(io.sockets.adapter.rooms.get(roomID) || []); //Якщо ми ще не підключені тоді цією стрічкою отримуємо всіх клієнтів в цій кімнаті. Тобто так отримуємо всіх клієнтів що підключені до цієї кімнати або пустий масив.

      clients.forEach((clientID) => {
        //Перебираємо всіх клієнтів - це буде id іншого сокета
        io.to(clientID).emit(ACTIONS.ADD_PEER, {
          //Кожному з цих клієнтів відправляємо наш екшн що говорить про нове з'єднання між клієнтами
          peerID: socket.id, //Відправляємо клієнту id даного сокета.
          createOffer: false, //так в даних що відправляємо вказуємо що клієнту не треба створювати offer до нього
        });

        socket.emit(ACTIONS.ADD_PEER, {
          // Даному сокету відправляємо наступні дані.
          peerID: clientID, //Так текущому сокету відправляємо event id клієнта
          createOffer: true, //так в даних що відправляємо вказуємо що даному сокету треба створити offer. І так вказуємо що офер створює лише той користувач що підключається в кімнату.
        });
      });

      socket.join(roomID); // Підключаємось до цієї кімнати
      shareRoomsInfo(); //Ділимось інформацією про те що в кімнату хтось підключився або створив нову кімнату - з усіма сокетами
    });

    function leaveRoom() {
      const { rooms } = socket; //Отримуємо всі кімнати з даного сокету

      Array.from(rooms) //Проходимось по всіх кімнатах
        // LEAVE ONLY CLIENT CREATED ROOM
        .filter((roomID) => validate(roomID) && version(roomID) === 4)
        .forEach((roomID) => {
          const clients = Array.from(
            //Так отримую клієнтів кімнати
            io.sockets.adapter.rooms.get(roomID) || []
          );

          clients.forEach((clientID) => {
            //Перебираємо всіх клієнтів і кожному клієнту відправляю екшн з виходом даного сокета і ід сокета що вийшов, тобто скажемо що ми виходимо з цієї кімнати
            io.to(clientID).emit(ACTIONS.REMOVE_PEER, {
              peerID: socket.id,
            });

            socket.emit(ACTIONS.REMOVE_PEER, {
              //Самому сокету відправляємо ід клієнтів аби від них теж відключитись
              peerID: clientID,
            });
          });

          socket.leave(roomID); //Залишаємо кімнату
        });

      shareRoomsInfo(); //Ділимось інформацією що користувач покинув кімнату
    }

    socket.on(ACTIONS.LEAVE, leaveRoom); //Логіка виходу з цієї кімнати
    socket.on('disconnecting', leaveRoom); //Функцію leaveRoom також викликатимо на відключення сокету

    socket.on(ACTIONS.RELAY_SDP, ({ peerID, sessionDescription }) => {
      //Тут описуємо серверну логіку для events RELAY_SDP - тобто коли приходить стріми
      io.to(peerID).emit(ACTIONS.SESSION_DESCRIPTION, {
        //Конкретному сокету відправляємо event з назвою ACTIONS.SESSION_DESCRIPTION
        peerID: socket.id, //відправляємо що event відправляється з поточного peer тобто що іде від нас
        sessionDescription, //Прокидаємо sessionDescription
      });
    });

    socket.on(ACTIONS.RELAY_ICE, ({ peerID, iceCandidate }) => {
      //Тут описуємо серверну логіку для events RELAY_ICE - тобто коли приходить ICE кандидат
      io.to(peerID).emit(ACTIONS.ICE_CANDIDATE, {
        peerID: socket.id,
        iceCandidate,
      });
    });
  });

  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    await new Promise((resolve) => app.listen({ port: 5001 }, resolve));
  } catch (e) {
    console.log('Чтото пошло не так ', e.message);
    process.exit(1);
  }
})();
