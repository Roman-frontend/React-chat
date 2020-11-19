import React from 'react'
import CancelPresentationOutlinedIcon from '@material-ui/icons/CancelPresentationOutlined';
import './end-action-button.sass'

export default function EndActionButton(props) {
  const { activeMessage, setActiveMessage, inputRef } = props
  const element = document.querySelector(".conversation-input__input")
  const topActiveMessageRelativeTopPage = element.getBoundingClientRect().top - 56

  function hideButtonExit() {
    console.log("hideButtonExit")
    const object = Object.assign({}, {...activeMessage}, {reply: undefined}, {changing: undefined});
    setActiveMessage({...object});
    inputRef.current.children[1].children[0].value = "";
  }
  

  return (
    <CancelPresentationOutlinedIcon
      className="conversation-input__end-action-button" 
      style={{top: `${topActiveMessageRelativeTopPage}px`}}
      fontSize="large"
      type="checkbox" 
      id="checkbox" 
      name="checkbox"
      onClick={hideButtonExit}
      inputProps={{ 'aria-label': 'primary checkbox' }}
    />
  )
}