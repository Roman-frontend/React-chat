import React from 'react'
import './end-action-button.sass'

export default function EndActionButton(props) {
  const { activeMessage, setActiveMessage, inputRef } = props
  const element = document.querySelector(".conversation-input__input")
  const topActiveMessageRelativeTopPage = element.getBoundingClientRect().top

  function hideButtonExit() {
    console.log("hideButtonExit")
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