const express = require('express')
const path = require('path')
const config = require('config')

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

app.use(express.static(path.resolve(__dirname, 'client', "src", "component")))

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'index.html'))
})

app.listen(PORT, () => console.log(`Server has been started on port ${PORT}...`))

