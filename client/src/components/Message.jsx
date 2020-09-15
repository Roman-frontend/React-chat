import React, {useState} from 'react'
import iconPeople from '../images/icon-people.png'

export default function Message(props) {
  const {message, activeMessage, setActiveMessage} = props
  const {username, text, createdAt, _id} = message
  const classMessage = message.reply ? "container-reply" : "container"
  const replyMessage = message.reply ? <div className="container__reply"><p>&#8593; {message.reply}</p></div> : null
  const reportsClick = () => {
    const object = Object.assign({}, {...activeMessage}, {id: _id}, {message})
    setActiveMessage({...object})
  }

  return (
    <div className={classMessage} id={_id} onMouseEnter={reportsClick} >
      <img className="container__icon" src={iconPeople} alt="icon-user"/>
      <p className="container__messager">{username}</p>
      <p className="container__date">{createdAt}</p>
      <p className="container__message">{text}</p>
      {replyMessage}
    </div>
  )
}