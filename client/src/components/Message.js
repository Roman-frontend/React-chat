import React, {useContext} from 'react'
import {Context} from '../context/context'
import EditMessage from './EditMessage'
import iconPeople from '../images/icon-people.png'

export default function Message(props) {
  const {message} = props
  const {username, text, createdAt, _id, listAction, reply} = props.message
  const {messages, setMessages} = useContext(Context)

  /**
  *Змінює значення свойства listAction яке
  *відповідає за появу чи зникання списку дій над повідомленням
  */
  function moreEdit() {
    const changeMas = messages.map(message => {
      if (message._id === _id) {
        message.listAction = !message.listAction 
        return message
      } else {
        message.listAction = false
        return message
      }
    })
    setMessages(changeMas)
  }

  /**Створює поле відповіді на повідомлення з текстом відповіді*/
  function createMessageReply() {
    if (message.reply) return <div className="reply"><p>&#8593; {message.reply}</p></div>
    return true
  }


  return (
    <div 
    className={ message.reply ? "container-reply" : "container" } 
    onClick={_id => moreEdit()}>
      <div className="icon">
        <img src={iconPeople} alt="icon-user"/>
      </div>

      <div className="messager"><p>{username}</p></div>
      <div className="date"><p>{createdAt}</p></div>

      <div className="more">
        <EditMessage 
          message={props.message}
         />
      </div>

      <div className="message">
        <p>{text}</p>
      </div>

      {createMessageReply()}
    </div>
  )
}