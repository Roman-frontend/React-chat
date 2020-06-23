import React from 'react'
import EditMessage from './EditMessage'
import '../css/OpinShareCSS.css'
import iconPeople from '../images/icon-people.png'
import iconMore from '../images/icon-more.png'

export default function HideButtonTextEdit(props) {
  const {messages, setMessages, inputRef} = props

  function hideButtonTextEdit() {
    let index = []
    const idMasEd = messages.find((i) => i.editText === true)
    const idMasAnswer = messages.find((i) => i.answer === true)
    
    if (idMasEd) {
      return <button className="button-text-edit" onClick={push => props.hideButton(true)}>X</button>
    } else return true
  }

  return hideButtonTextEdit()
}
