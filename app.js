const express = require('express');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { graphqlHTTP } = require('express-graphql');
const path = require('path');
const config = require('config');
const mongoose = require('mongoose');
const app = express();
const typeDefs = require('./schema/types/index');
const resolvers = require('./schema/resolvers/index');
const server = require('./Soket/soket');
//const schema = require('./schema/schema');
//cors(cross origane resorse sharing) - дозволяє створювати кросдоменні запити - без нього запити з фронтенда на бекенд і навпаки не будуть коректно спрацьовувати. cors - дозволяє серверу відповідати фронтенду.
const cors = require('cors');
//express-graphql - пакет що дозволяє нашому експрес серверу спокійно використовувати graphql-api

const schema = makeExecutableSchema({ typeDefs, resolvers });

app.use(cors());

//graphqlHTTP - використовуємо як middlewsre на певному роуті(шляху)
app.use('/graphql', graphqlHTTP({ schema, graphiql: true }));

//дозволить коректно парсити body який приходить з фронтента бо по замовчуванні node js сприймає body як
//стріми(потік даних) - тобто як дані з фротента що передаються частинами що не дозволить прочитати їх
app.use(express.json({ extended: true }));
app.use(express.static(path.resolve(__dirname, 'client', 'src', 'components')));

app.get('*', (req, res) => {
  res
    .status(200)
    .sendFile(path.resolve(__dirname, 'client', 'public', 'index.html'));
});

const PORT = config.get('port') || 5000;

const dbConnection = mongoose.connection;

dbConnection.on('error', (err) => console.log(`error on ${err} `));
dbConnection.once('open', () => console.log('Connected to DB!'));

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('mongoose conected');
    app.listen(PORT, () =>
      console.log(`Server has been started on port ${PORT}...`)
    );
  } catch (e) {
    console.log('Чтото пошло не так ', e.message);
    process.exit(1);
  }
}

start();
