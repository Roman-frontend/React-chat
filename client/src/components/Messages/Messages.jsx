import React, { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import {useMessagesContext} from '../../context/MessagesContext.js'
import Message from '../Message/Message.jsx'
import MessageActionsPopup from '../MessageActionsPopup/MessageActionsPopup.jsx'
import './messages.sass'

export function Messages(props) {
  const { activeMessage, setActiveMessage } = props
  const reduxMessages = useSelector(state => state.messages)
  const { setIsBlockedInput } = useMessagesContext()
  
  const reverseMsg = useMemo (() => {
    return reduxMessages.reverse() 
  }, [reduxMessages])

  const renderMessages = useCallback(() => {
    console.log("reduxMessages ", reverseMsg)
    if(reduxMessages === "403") {
      setIsBlockedInput(true)

    } else {      
      return reverseMsg.map((message) => {
        return ( 
          <Message 
            key={message._id || message.id} 
            message={message} 
            activeMessage={activeMessage}
            setActiveMessage={setActiveMessage}
          />
        )
      })
    } //else console.error('messages is not array or undefined, value messages: ', reverseMsg)
  }, [reverseMsg])

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