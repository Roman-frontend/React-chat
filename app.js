const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const config = require('config');
const mongoose = require('mongoose');
const typeDefs = require('./graphql/types/index');
const resolvers = require('./graphql/resolvers/index');
const { verifyToken } = require('./middlewares');
const cors = require('cors');
require('./Soket/soket');

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
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    await new Promise((resolve) => app.listen({ port: 5000 }, resolve));
  } catch (e) {
    console.log('Чтото пошло не так ', e.message);
    process.exit(1);
  }
})();
