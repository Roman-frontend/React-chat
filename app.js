const path = require('path');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const config = require('config');
const mongoose = require('mongoose');
const typeDefs = require('./graphql/types/index');
const resolvers = require('./graphql/resolvers/index');
const { verifyToken } = require('./middlewares');
const cors = require('cors');
const socketio = require('socket.io');
const { version, validate } = require('uuid');
require('./Soket/soket');

const ACTIONS = require('./client/src/socket.io/actions');

const PORT = process.env.PORT || 5001;

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

  const publicPath = path.join(__dirname, 'client', 'public');

  app.use(express.static(publicPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });

  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    const http = app.listen({ port: PORT }, () =>
      console.log(`server started on PORT: ${PORT}...`)
    );
    const io = socketio(http);

    function getClientRooms() {
      const { rooms } = io.sockets.adapter;

      return Array.from(rooms.keys()).filter(
        (roomID) => validate(roomID) && version(roomID) === 4
      );
    }

    function shareRoomsInfo() {
      io.emit(ACTIONS.SHARE_ROOMS, {
        rooms: getClientRooms(),
      });
    }

    io.on('connection', (socket) => {
      shareRoomsInfo();

      socket.on(ACTIONS.JOIN, (config) => {
        const { room: roomID } = config;
        const { rooms: joinedRooms } = socket;

        if (Array.from(joinedRooms).includes(roomID)) {
          return console.warn(`Already joined to ${roomID}`);
        }

        const clients = Array.from(io.sockets.adapter.rooms.get(roomID) || []);

        clients.forEach((clientID) => {
          io.to(clientID).emit(ACTIONS.ADD_PEER, {
            peerID: socket.id,
            createOffer: false,
          });

          socket.emit(ACTIONS.ADD_PEER, {
            peerID: clientID,
            createOffer: true,
          });
        });

        socket.join(roomID);
        shareRoomsInfo();
      });

      function leaveRoom() {
        const { rooms } = socket;

        Array.from(rooms)
          // LEAVE ONLY CLIENT CREATED ROOM
          .filter((roomID) => validate(roomID) && version(roomID) === 4)
          .forEach((roomID) => {
            const clients = Array.from(
              io.sockets.adapter.rooms.get(roomID) || []
            );

            clients.forEach((clientID) => {
              io.to(clientID).emit(ACTIONS.REMOVE_PEER, {
                peerID: socket.id,
              });

              socket.emit(ACTIONS.REMOVE_PEER, {
                peerID: clientID,
              });
            });

            socket.leave(roomID);
          });

        shareRoomsInfo();
      }

      socket.on(ACTIONS.LEAVE, leaveRoom);
      socket.on('disconnecting', leaveRoom);

      socket.on(ACTIONS.RELAY_SDP, ({ peerID, sessionDescription }) => {
        io.to(peerID).emit(ACTIONS.SESSION_DESCRIPTION, {
          peerID: socket.id,
          sessionDescription,
        });
      });

      socket.on(ACTIONS.RELAY_ICE, ({ peerID, iceCandidate }) => {
        io.to(peerID).emit(ACTIONS.ICE_CANDIDATE, {
          peerID: socket.id,
          iceCandidate,
        });
      });
    });
  } catch (e) {
    console.log('Чтото пошло не так ', e.message);
    process.exit(1);
  }
})();
