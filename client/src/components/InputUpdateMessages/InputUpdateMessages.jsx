import React, {useEffect, useLayoutEffect} from 'react'
import {useAuthContext} from '../../context/AuthContext.js'
import {useMessagesContext} from '../../context/MessagesContext.js'
import {useServer} from '../../hooks/Server.js'
import './input-message.sass'

export default function InputUpdateMessages(props) {

  const {name, userId} = useAuthContext()
  const {messages, setMessages, inputRef} = useMessagesContext()
  const {postData, putData, getData} = useServer()
  const {activeMessage, setActiveMessage} = props

  const copyMessages = messages.slice(0, messages.length);
  let updatedArrayMessages = []

  useLayoutEffect(() => {
    inputRef.current.focus();
    getData()
  }, [userId]);

  function inputUpdateMessages(event) {
    if ((event.key === "Enter") && !(inputRef.current.value === "")) {
      if (activeMessage.change) changeMessageText()
      else if (activeMessage.reply) messageInReply(inputRef.current.value)
      else newMessage(inputRef.current.value)
      
      setMessages(updatedArrayMessages)   
      inputRef.current.value = null
    }
  }

  async function changeMessageText() {
    let putMessage = []

    updatedArrayMessages = messages.map(message => {
      if (message._id === activeMessage.change) {
        message.text = inputRef.current.value
        putMessage.push(message)
        return message
      } else return message
    })
    
    await putData(putMessage[0], activeMessage.change)
    const object = Object.assign({}, {...activeMessage}, {'change': null})
    setActiveMessage({...object})
  }

  const messageInReply = async response => {
    const answerTo = messages.find(message => message._id === activeMessage.reply);
    copyMessages.unshift({
      userId: userId,
      username: name, 
      text: activeMessage.reply.text, 
      createdAt: new Date().toLocaleString(), 
      reply: response,
    },) 
   
    postData(`/api/chat/post-message`, copyMessages[0])
    updatedArrayMessages = copyMessages
    const object = Object.assign({}, {...activeMessage}, {reply: null})
    setActiveMessage({...object}) 
  }

  function newMessage(textMessage) {
    
    copyMessages.unshift({
      userId: userId,
      username: name, 
      text: textMessage, 
      createdAt: new Date().toLocaleString(), 
    },)  

    updatedArrayMessages = copyMessages
    postData(`/api/chat/post-message`, updatedArrayMessages[0])
  }

  return (
    <input 
      type="text" 
      className="conversation-input__input" 
      placeholder="Enter Text" 
      ref={inputRef} 
      onKeyUp={event => inputUpdateMessages(event)}
    />
  )
}