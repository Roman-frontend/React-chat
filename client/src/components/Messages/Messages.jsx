import React, { useLayoutEffect, useEffect } from 'react'
import { useAuthContext } from '../../context/AuthContext.js'
import { useMessagesContext } from '../../context/MessagesContext.js'
import { useServer } from '../../hooks/Server.js'
import Message from '../Message/Message.jsx'
import MessageActionsPopup from '../MessageActionsPopup/MessageActionsPopup.jsx'
import './messages.sass'

export default function Messages(props) {
  const { userId } = useAuthContext()
  const { messages, setMessages, activeChannelId } = useMessagesContext()
  const { getData } = useServer()
  const { activeMessage, setActiveMessage } = props

  useEffect(() => {
    async function getMessages() {
      const receivedServerMessages = await getData("getMessages", activeChannelId)
      if (receivedServerMessages) setMessages(receivedServerMessages.messages.reverse())
    }

    getMessages()
  }, [activeChannelId])

  function renderMessages() {
    return messages.map((message, index) => {
      return ( 
        <Message 
          key={message._id || message.id} 
          message={message} 
          activeMessage={activeMessage}
          setActiveMessage={setActiveMessage} 
        />
      )
    })
  }

  return (
    <div className="messages">
      {renderMessages()}
      <MessageActionsPopup 
        activeMessage={activeMessage} 
        setActiveMessage={setActiveMessage} 
      />
    </div>
  )
}