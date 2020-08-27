import React from 'react'
import {useMessagesContext} from '../context/MessagesContext'

export default function EndActionButton(props) {
  const {inputRef} = useMessagesContext()
  const { activeMessage, setActiveMessage } = props

  function hideButtonExit() {
    const object = Object.assign({}, {...activeMessage}, {idMessageForAnswer: undefined}, {idMessageForChange: undefined});
    setActiveMessage({...object});
    inputRef.current.value = "";
  }
  

  return <button className="button-text-edit" onClick={hideButtonExit}>X</button>
}