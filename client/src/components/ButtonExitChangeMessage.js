import React from 'react'
import {useMessagesContext} from '../context/MessagesContext'

export default function ButtonExitChangeMessage(props) {
  const {messageActions, setMessageActions, inputRef} = useMessagesContext()

  function hideButtonExit() {
    const object = Object.assign({}, {...messageActions}, {change: null}, {answerTo: null});
    setMessageActions({...object});
    inputRef.current.value = "";
  }
  

  if (messageActions.change || messageActions.answerTo) {
    return <button className="button-text-edit" onClick={hideButtonExit}>X</button>
  } 

  return null
}