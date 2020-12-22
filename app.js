const express = require('express');
const path = require('path');
const config = require('config');
const mongoose = require('mongoose');
const app = express();
const server = require('./soket');

//дозволить коректно парсити body який приходить з фронтента бо по замовчуванні node js сприймає body як
//стріми(потік даних) - тобто як дані з фротента що передаються частинами що не дозволить прочитати їх
app.use(express.json({ extended: true }));

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/chat', require('./routes/chat.message'));
app.use('/api/channel', require('./routes/chat.channel'));
app.use('/api/direct-message', require('./routes/direct.message'));
app.use('/api/direct-message-chat', require('./routes/direct.message.chat'));

app.use(express.static(path.resolve(__dirname, 'client', 'src', 'components')));

app.get('*', (req, res) => {
  console.log('Запит за неоприділеним URL', req.path);
  res
    .status(200)
    .sendFile(path.resolve(__dirname, 'client', 'public', 'index.html'));
});

const PORT = config.get('port') || 5000;

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
