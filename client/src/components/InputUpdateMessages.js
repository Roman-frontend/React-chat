import React, {useContext} from 'react'
import {AuthContext} from '../context/AuthContext'
import {Context} from '../context/context'
import {useServer} from '../hooks/Server'

export default function InputUpdateMessages(props) {
  const {name, userId} = useContext(AuthContext)
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
    let putMessage = []

    updatedArrayMessages = messages.map(message => {
      if (message === changedMessage) {
        message.text = inputRef.current.value
        message.changed = false
        putMessage.push(message)
        return message
      } else return message
    })
    
    putData(putMessage[0], changedMessage._id, setMessages, messages)
  }

  function messageInReply(response) {

    copyMessages.unshift({
      username: name, 
      text: answerTo.text, 
      createdAt: new Date().toLocaleString(), 
      _id: Date.now(), 
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
    postData(userId, updatedArrayMessages, setMessages)
  }

  function newMessage(textMessage) {
    
    copyMessages.unshift({
      username: name, 
      text: textMessage, 
      createdAt: new Date().toLocaleString(), 
      listAction: false, 
      changed: false, 
      answer: false, 
      reply: ""},
    )  

    updatedArrayMessages = copyMessages
    postData(userId, updatedArrayMessages, setMessages)
  }

  return <input type="text" className="input-message" placeholder="Enter Text" ref={inputRef} onKeyUp={event => inputUpdateMessages(event)}/>
}