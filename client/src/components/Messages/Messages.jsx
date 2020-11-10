import React, { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import Message from '../Message/Message.jsx'
import MessageActionsPopup from '../MessageActionsPopup/MessageActionsPopup.jsx'
import './messages.sass'

export function Messages(props) {
  const { activeMessage, setActiveMessage, inputRef } = props
  const reduxMessages = useSelector(state => state.messages)
  
  const reverseMsg = useMemo (() => {
    //console.log(reduxMessages)
    return reduxMessages === "403" ? "403" : reduxMessages.reverse() 
  }, [reduxMessages])

  const renderMessages = useCallback(() => {
    //console.log("reduxMessages ", reverseMsg)
    if (reduxMessages !== "403") {      
      return reverseMsg.map((message) => {
        return <Message 
            key={message._id || message.id} 
            message={message} 
            activeMessage={activeMessage}
            setActiveMessage={setActiveMessage}
        />
      })
    }
  }, [reverseMsg])

  return (
    <div className="messages">
      {renderMessages()}
      <MessageActionsPopup 
        activeMessage={activeMessage} 
        setActiveMessage={setActiveMessage} 
        inputRef={inputRef}
      />
    </div>
  )
}