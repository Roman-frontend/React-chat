import React, {useContext} from 'react'
import {Context} from '../context/context'
import {useServer} from '../hooks/Server'

export default function InputUpdateMessages(props) {
  const {messages, setMessages, setShowAnswer, inputRef} = useContext(Context)
  const {postData, putData} = useServer()
  const copyMessages = messages.slice(0, messages.length);
  const changedMessage = messages.find(message => message.changed === true)
  const answerTo = messages.find(message => message.answer === true)
  let updatedArrayMessages = []

  function inputUpdateMessages(event) {
    if (event.key === "Enter") {
      if (inputRef.current.value === "") return

      if (changedMessage) changeMessageText()
      else if (answerTo) messageInReply(inputRef.current.value)
      else newMessage(inputRef.current.value)
      
      setMessages(updatedArrayMessages)
      setShowAnswer(false)
      inputRef.current.value = null
    }
  }

  function changeMessageText() {

    updatedArrayMessages = messages.map(message => {
      if (message === changedMessage) {
        message.text = inputRef.current.value
        message.changed = false
        return message
      } else return message
    })

    putData(changedMessage.id, setMessages, messages)
  }

  function messageInReply(response) {

    copyMessages.unshift({
      username: 'Yulia', 
      text: answerTo.text, 
      createdAt: new Date().toLocaleString(), 
      id: Date.now(), 
      listAction: false, 
      changed: false, 
      answer: false, 
      reply: response},
    ) 

    updatedArrayMessages = copyMessages.map(message => {
      if (message.answer) {
        message.answer = false
        return message
      } else return message
    })       
    postData(updatedArrayMessages)
  }

  function newMessage(textMessage) {
    
    copyMessages.unshift({
      username: 'Yulia', 
      text: textMessage, 
      createdAt: new Date().toLocaleString(), 
      id: Date.now(), 
      listAction: false, 
      changed: false, 
      answer: false, 
      reply: ""},
    )  

    updatedArrayMessages = copyMessages
    postData(updatedArrayMessages)
  }

  return <input type="text" className="input-message" placeholder="Enter Text" ref={inputRef} onKeyUp={event => inputUpdateMessages(event)}/>
}