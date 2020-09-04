import React, {useState} from 'react'
import {useMessagesContext} from '../context/MessagesContext'
import {useServer} from '../hooks/Server'
import iconPeople from '../images/icon-people.png'

export default function Message(props) {
  const {message, activeMessage, setActiveMessage} = props
  const {username, text, createdAt, _id} = message
  const classMessage = message.reply ? "container-reply" : "container"
  const replyMessage = message.reply ? <div className="reply"><p>&#8593; {message.reply}</p></div> : null
  const [styleContainer, setStyleContainer] = useState({})
  const setsMessage = () => {
    const object = Object.assign({}, {...activeMessage}, {id: _id}, {message})
    setActiveMessage({...object})
    setStyleContainer({background: '#f5f5f5'})
  }

  return (
    <div 
      className={classMessage} 
      id={_id} 
      style={styleContainer} 
      onMouseEnter={setsMessage} 
      onMouseLeave={() => setStyleContainer({background: '#ffffff'})} 
    >
      <img className="icon" src={iconPeople} alt="icon-user"/>
      <p className="messager">{username}</p>
      <p className="date">{createdAt}</p>
      <p className="message">{text}</p>
      {replyMessage}
    </div>
  )
}