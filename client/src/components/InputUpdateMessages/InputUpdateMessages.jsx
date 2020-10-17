import React, {useState, useLayoutEffect, useEffect} from 'react'
import {useAuthContext} from '../../context/AuthContext.js'
import {useMessagesContext} from '../../context/MessagesContext.js'
import {useServer} from '../../hooks/Server.js'
import './input-message.sass'

export default function InputUpdateMessages(props) {
  const { name, userId, token } = useAuthContext()
  const { messages, setMessages, inputRef, activeChannelId, setIsBlockedInput } = useMessagesContext()
  const { postData, putData } = useServer()
  const { activeMessage, setActiveMessage } = props


  const copyMessages = messages.slice(0, messages.length);
  let updatedArrayMessages = []

  useEffect(() => { inputRef.current.focus() }, [])

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
    
    const resPut = await putData(putMessage[0], activeMessage.change, null, token)
    if (resPut.messages) setMessages(resPut.messages.reverse())
    const object = Object.assign({}, {...activeMessage}, {'change': null})
    setActiveMessage({...object})
  }

  const messageInReply = async response => {
    copyMessages.unshift({
      id: Date.now(),
      userId,
      username: name, 
      text: activeMessage.reply.text, 
      createdAt: new Date().toLocaleString(), 
      channelId: activeChannelId,
      reply: response,
    },) 
   
    const resPost = await postData("postMessage", token, { userId, ...copyMessages[0] }, activeChannelId)

    if (resPost.channelMessages) {
      setMessages(resPost.channelMessages.reverse())
    } else if (resPost === "403") { setIsBlockedInput(true) }

    updatedArrayMessages = copyMessages
    const object = Object.assign({}, {...activeMessage}, {reply: null})
    setActiveMessage({...object}) 
  }

  async function newMessage(textMessage) {
    
    copyMessages.unshift({
      id: Date.now(),
      userId,
      username: name, 
      text: textMessage, 
      createdAt: new Date().toLocaleString(),
      channelId: activeChannelId,
    }, )  

    const resPost = await postData("postMessage", token, { userId, ...copyMessages[0] }, activeChannelId)
    if (resPost) {

      if (resPost.channelMessages) {
        setMessages(resPost.channelMessages.reverse())
      } else if (resPost === "403") { setIsBlockedInput(true) }

      updatedArrayMessages = copyMessages
    }
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