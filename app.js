const express = require('express')
const jwt = require('jsonwebtoken');
const path = require('path')
const config = require('config')
const mongoose = require('mongoose')

const app = express()

//дозволить коректно парсити body який приходить з фронтента бо по замовчуванні node js сприймає body як 
//стріми(потік даних) - тобто як дані з фронтента що передаються частинами що не дозволить прочитати їх
app.use(express.json({extended: true}))

//app.use(express.json())
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/chat', require('./routes/chat.message'))
app.use('/api/channel', require('./routes/chat.channel'))

/*function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  console.log("===========   ========    ", bearerHeader)
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}*/

// /api - буде префікс для будь якого запиту, /auth - для роботи з авторизацією, 2-й параметр шлях до route що оброблятиме авторизацію
//app.use('/api/auth', require('./routes/auth.routes'))

app.use(express.static(path.resolve(__dirname, 'client', "src", "components")))

app.get('*', (req, res) => {
  console.log('Запит за неоприділеним URL', req.path)
  res.status(200).sendFile(path.resolve(__dirname, 'client', 'public', 'index.html'))
})

const PORT = config.get('port') || 5000

function verifyAuthenticate(req, res, next) {
  const authHeader = req.headers['authorization']
  console.log("authHeader ", authHeader)
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)


  jwt.verify( token, config.get("jwtSecret"), (err, success) => {
    console.log(error ? error : success) 
    next()
  })
}

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    console.log("mongoose conected")
    app.listen(PORT, () => console.log(`Server has been started on port ${PORT}...`))
  } catch (e) {
    console.log("Чтото пошло не так ", e.message)
    process.exit(1)
  }
}

start()
