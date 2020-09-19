import React from 'react'
import {useMessagesContext} from '../../context/MessagesContext.js'
import Message from '../Message/Message.jsx'
import MessageActionsPopup from '../MessageActionsPopup/MessageActionsPopup.jsx'
import './messages.sass'

export default function Messages(props) {
  const {messages} = useMessagesContext()

  function renderMessages() {
    return messages.map((message, index) => {
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
    <div className="messages">
      {renderMessages()}
      <MessageActionsPopup activeMessage={props.activeMessage} setActiveMessage={props.setActiveMessage} />
    </div>
  )
}