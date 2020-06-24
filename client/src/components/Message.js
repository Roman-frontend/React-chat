import React, {useContext} from 'react'
import {Context} from '../context/context'
import EditMessage from './EditMessage'
import iconPeople from '../images/icon-people.png'

export default function Message(props) {
  const {message} = props
  const {username, text, createdAt, id, more} = props.message
  const {messages, setMessages} = useContext(Context)
  const anything = []

  function moreEdit(id) {
    let changeMas = messages.map(i => {
      if (i.id === id) {
        i.more = !i.more 
        return i
      } else {
        i.more = false
        return i
      }
    })
    setMessages(changeMas)
  }

  function reply() {
    if (message.reply) return <div className="reply"><p>&#8593; {message.reply}</p></div>
    return true
  }


  return (
    <div 
    className={ message.reply ? "container-reply" : "container" } 
    onClick={id => moreEdit(message.id)}>
      <div className="icon">
        <img src={iconPeople} alt="icon-user"/>
      </div>

      <div className="messager"><p>{username}</p></div>
      <div className="date"><p>{createdAt}</p></div>

      <div className="more">
        <EditMessage 
          message={props.message}
          ind={props.index}
         />
      </div>

      <div className="message">
        <p>{text}</p>
      </div>

      {reply()}
    </div>
  )
}