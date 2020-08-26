import React, {useEffect} from 'react'
import {useAuthContext} from '../context/AuthContext'
import {useMessagesContext} from '../context/MessagesContext'
import {useServer} from '../hooks/Server'

export default function InputUpdateMessages(props) {

  const {name, userId} = useAuthContext()
  const {messages, setMessages, messageActions, setMessageActions, inputRef} = useMessagesContext()
  const {postData, putData, getData} = useServer()
  const copyMessages = messages.slice(0, messages.length);
  let updatedArrayMessages = []

  useEffect(() => {
    inputRef.current.focus();
    getData()
  }, [ , userId]);

  function inputUpdateMessages(event) {
    if ((event.key === "Enter") && !(inputRef.current.value === "")) {
      if (messageActions.change) changeMessageText()
      else if (messageActions.answerTo) messageInReply(inputRef.current.value)
      else newMessage(inputRef.current.value)
      
      setMessages(updatedArrayMessages)   
      inputRef.current.value = null
    }
  }

  async function changeMessageText() {
    let putMessage = []

    updatedArrayMessages = messages.map(message => {
      if (message._id === messageActions.change) {
        message.text = inputRef.current.value
        putMessage.push(message)
        return message
      } else return message
    })
    
    await putData(putMessage[0], messageActions.change)
    const object = Object.assign({}, {...messageActions}, {'change': null})
    setMessageActions({...object})
  }

  function messageInReply(response) {
    const answerTo = messages.find(message => message._id === messageActions.answerTo);
    copyMessages.unshift({
      userId: userId,
      username: name, 
      text: answerTo.text, 
      createdAt: new Date().toLocaleString(), 
      _id: Date.now(), 
      reply: response
    },) 
 
    const object = Object.assign({}, {...messageActions}, {answerTo: null})
    setMessageActions({...object})    
    postData(`/api/chat/post-message`, copyMessages[0])
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
      className="input-message" 
      placeholder="Enter Text" 
      ref={inputRef} 
      onKeyUp={event => inputUpdateMessages(event)}
    />
  )
}