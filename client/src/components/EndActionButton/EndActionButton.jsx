import React from 'react'
import {useMessagesContext} from '../../context/MessagesContext.js'
import './end-action-button.sass'

export default function EndActionButton(props) {
  const {inputRef} = useMessagesContext()
  const { activeMessage, setActiveMessage } = props
  const element = document.querySelector(".conversation-input__input")
  const topActiveMessageRelativeTopPage = element.getBoundingClientRect().top

  function hideButtonExit() {
    const object = Object.assign({}, {...activeMessage}, {reply: undefined}, {changing: undefined});
    setActiveMessage({...object});
    inputRef.current.value = "";
  }
  

  return (
  	<button 
  	  className="conversation-input__end-action-button" 
  	  style={{top: `${topActiveMessageRelativeTopPage + 11}px`}} 
  	  onClick={hideButtonExit}
  	>
  	  X
  	</button>
  )
}