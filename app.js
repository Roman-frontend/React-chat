const express = require('express')
const path = require('path')
const config = require('config')

const app = express()
const PORT = config.get('port') || 5000

app.use(express.json({extended: true}))

let CONTACTS = [
  {username: "Yulia", text: "Message from CONTACTS", createdAt: "16:06 12.05.2020", id: 1591967167630}
]

app.use(express.json())

app.get('/api/contacts', (req, res) => {
    res.status(200).json(CONTACTS)
})

app.post('/api/contacts', (req, res) => {
    const contact = {...req.body}
    CONTACTS.unshift(contact)
    console.log(CONTACTS)
    res.status(201).json(CONTACTS)
})

/*app.delete('/api/contacts/:id', (req, res) => {
  CONTACTS = CONTACTS.filter(c => c.id !== req.params.id)
  res.status(200).json({message: 'Контакт был удален'})
})

app.put('/api/contacts/:id', (req, res) => {
  const idx = CONTACTS.findIndex(c => c.id === req.params.id)
  CONTACTS[idx] = req.body
  res.json(CONTACTS[idx])
})*/

app.use(express.static(path.resolve(__dirname, 'client', "src", "component")))

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'index.html'))
})

app.listen(PORT, () => console.log(`Server has been started on port ${PORT}...`))

