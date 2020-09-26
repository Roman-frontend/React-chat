import React from 'react'
import iconPeople from '../../images/icon-people.png'
import './message.sass'

export default function Message(props) {
  const {message, activeMessage, setActiveMessage} = props
  const {username, text, createdAt, _id, id} = message
  const messageId = _id ? _id : id

  const classMessage = message.reply ? "container-reply" : "container"
  const replyMessage = message.reply ? <p className={`${classMessage}__reply`}>&#8593; {message.reply}</p> : null

  const reportsClick = () => {
    const object = Object.assign({}, {...activeMessage}, {id: messageId}, {message})
    setActiveMessage({...object})
  }

  return (
    <div className={classMessage} id={messageId} onMouseEnter={reportsClick}>
      <img className={`${classMessage}__icon`} src={iconPeople} alt="icon-user"/>
      <p className={`${classMessage}__messager`}>{username}</p>
      <p className={`${classMessage}__date`}>{createdAt}</p>
      <p className={`${classMessage}__message`}>{text}</p>
      {replyMessage}
    </div>
  )
}