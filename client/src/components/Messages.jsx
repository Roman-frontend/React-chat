import React from 'react'
import {useMessagesContext} from '../context/MessagesContext.js'
import Message from './Message.jsx'
import MessageActionsPopup from './MessageActionsPopup.jsx'

export default function Messages(props) {
  const {messages} = useMessagesContext()

  function renderMessages() {
    return messages.map((message) => {
      return ( 
        <Message 
          key={message._id} 
          message={message} 
          activeMessage={props.activeMessage}
          setActiveMessage={props.setActiveMessage} 
        />
      )
    })
  }

  return (
    <div className="chat">
      {renderMessages()}
      <MessageActionsPopup activeMessage={props.activeMessage} setActiveMessage={props.setActiveMessage} />
    </div>
  )
}