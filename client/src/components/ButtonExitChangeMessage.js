import React, {useContext} from 'react'
import {Context} from '../context/context'

export default function ButtonExitChangeMessage(props) {

  const {messages, setMessages, setShowAnswer, inputRef, showButtonExit, setShowButtonExit} = useContext(Context)
  const messageChanging = messages.find((message) => message.changed === true)

  function hideButtonExit() {
  	if (showButtonExit) {
      const changeMas = messages.map(message => {
        if (message.changed) {
          message.changed = !message.changed 
          return message
        } else return message
      })
      inputRef.current.value = ""
      if (changeMas) setMessages(changeMas)
    }
  }
  

  if (messageChanging + 1) {
    setShowButtonExit(true)
    return <button className="button-text-edit" onClick={hideButtonExit}>X</button>
  } else return true
}