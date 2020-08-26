import React from 'react'
import {useMessagesContext} from '../context/MessagesContext'
import Message from './Message'

export default function Messages(props) {
  const {messages} = useMessagesContext()

  function renderMessages() {
    return messages.map((message) => {
      return <Message key={message._id} message={message} />
    })
  }

  return (
    <div className="chat-with-people">
      {renderMessages()}
    </div>
  )
}