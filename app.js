const express = require('express')
const path = require('path')
const config = require('config')
const mongoose = require('mongoose')
const app = express()

const PORT = config.get('port') || 5000

app.use(express.json({extended: true}))

let MESSAGES = []

app.use(express.json())

app.get('/api/contacts', (req, res) => {
  console.log("get ", MESSAGES)
  res.status(200).json(MESSAGES)
})

app.post('/api/contacts', (req, res) => {
  console.log("post ", MESSAGES[0])
  const contact = {...req.body}
  MESSAGES.unshift(contact)
  res.status(201).json(MESSAGES)
})

app.delete('/api/contacts/:id', (req, res) => {
  MESSAGES = MESSAGES.filter(c => c.id != req.params.id)
  console.log("delete ", MESSAGES)
  res.status(200).json({message: 'Контакт был удален'})
})

app.put('/api/contacts/:id', (req, res) => {
  const idx = MESSAGES.findIndex(c => c.id == req.params.id)
  console.log("idx from put ", idx)
  MESSAGES[idx] = req.body
  res.json(MESSAGES[idx])
})

// /api - буде префікс для будь якого запиту, /auth - для роботи з авторизацією, 2-й параметр шлях до route що оброблятиме авторизацію
app.use('/api/auth', require('./routes/auth.routes'))

app.use(express.static(path.resolve(__dirname, 'client', "src", "components")))

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'index.html'))
})

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    app.listen(PORT, () => console.log(`Server has been started on port ${PORT}...`))
  } catch (e) {
    console.log("Чтото пошло не так ", e.message)
    process.exit(1)
  }
}

start()
