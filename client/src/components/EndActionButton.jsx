import React from 'react'
import {useMessagesContext} from '../context/MessagesContext.js'

export default function EndActionButton(props) {
  const {inputRef} = useMessagesContext()
  const { activeMessage, setActiveMessage } = props

  function hideButtonExit() {
    const object = Object.assign({}, {...activeMessage}, {answering: undefined}, {changing: undefined});
    setActiveMessage({...object});
    inputRef.current.value = "";
  }
  

  return <button className="right-block__button-hide-answer-change" onClick={hideButtonExit}>X</button>
}