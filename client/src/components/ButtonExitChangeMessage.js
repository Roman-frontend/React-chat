import React from 'react'
import {useMessagesContext} from '../context/MessagesContext'

export default function ButtonExitChangeMessage(props) {
  const {messages, setMessages, action, setAction, inputRef} = useMessagesContext()

  function hideButtonExit() {
    const object = Object.assign({}, {...action}, {'change': null})
    setAction({...object})
    inputRef.current.value = ""
  }
  

  if (action.change) {
    return <button className="button-text-edit" onClick={hideButtonExit}>X</button>
  } 

  return null
}