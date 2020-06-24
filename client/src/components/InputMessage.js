import React, {useContext} from 'react'
import {Context} from '../context/context'
import {useServer} from '../hooks/Server'

export default function InputMessage(props) {
  const {messages, setMessages, setShowAnswer, inputRef} = useContext(Context)
  const {postData, putData} = useServer()
  const copyMessages = messages.slice(0, messages.length);
  const idMasEd = messages.find(i => i.editText === true)
  const idMasAnswer = messages.find(i => i.answer === true)
  let editedMessages = []

  function keyInput(event) {
    if (event.key === "Enter") {
      if (inputRef.current.value === "") return

      if (idMasEd) changeTextMessage()
      else if (idMasAnswer) answerTo(inputRef.current.value)
      else newMessage(inputRef.current.value)
      
      setMessages(editedMessages)
      setShowAnswer(false)
      inputRef.current.value = null
    }
  }

  function changeTextMessage() {

    editedMessages = messages.map(i => {
      if (i === idMasEd) {
        i.text = inputRef.current.value
        i.editText = false
        return i
      } else return i
    })

    putData(idMasEd.id, setMessages, messages)
  }

  function answerTo(response) {

    copyMessages.unshift({
      username: 'Yulia', 
      text: idMasAnswer.text, 
      createdAt: new Date().toLocaleString(), 
      id: Date.now(), 
      more: false, 
      editText: false, 
      answer: false, 
      index: false, 
      reply: response},
    ) 

    editedMessages = copyMessages.map(i => {
      if (i.index + 1) {
        i.index = false
        i.answer = false
        return i
      } else return i
    })       
    postData(editedMessages)
  }

  function newMessage(textMessage) {
    
    copyMessages.unshift({
      username: 'Yulia', 
      text: textMessage, 
      createdAt: new Date().toLocaleString(), 
      id: Date.now(), 
      more: false, 
      editText: false, 
      answer: false, 
      index: false, 
      reply: false},
    )  

    editedMessages = copyMessages
    postData(editedMessages)
  }

  return <input type="text" className="input-message" placeholder="Enter Text" ref={inputRef} onKeyUp={event => keyInput(event)}/>
}