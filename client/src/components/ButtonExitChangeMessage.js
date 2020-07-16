import React, {useContext} from 'react'
import {Context} from '../context/context'

export default function ButtonExitChangeMessage(props) {

  const {messages, setMessages, inputRef, showButtonExit, setShowButtonExit} = useContext(Context)
  const messageChanging = messages.find(message => message.changed === true)

  function hideButtonExit() {
    const changeMessages = messages.map(message => {
      if (message.changed) {
        message.changed = !message.changed 
        return message
      } else return message
    })
    inputRef.current.value = ""
    setMessages(changeMessages)
  }
  

  if (messageChanging !== undefined) {
    setShowButtonExit(true)
    return <button className="button-text-edit" onClick={hideButtonExit}>X</button>
  } else return true
}