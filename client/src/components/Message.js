import React from 'react'
import EditMessage from './EditMessage'
import iconPeople from '../images/icon-people.png'
import iconMore from '../images/icon-more.png'

export default function Message(props) {
  const {messages, setMessages, ind, message} = props
  const {username, text, createdAt, id, more, editText, answer} = props.message

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
    if (message.reply) return <div className="reply"><p>{message.reply}</p></div>
    return true
  }


  return (
    <div className={ message.reply ? "container-reply" : "container" } onClick={id => moreEdit(props.message.id)}>
      <div className="icon"><img src={iconPeople} alt="icon-user"/></div>
      <div className="messager"><p>{username}</p></div>
      <div className="date"><p>{createdAt}</p></div>
      <div className="more">
        <EditMessage 
          message={props.message}
          ind={props.ind}
          setMessages={props.setMessages}
          messages={props.messages}
          inputRef={props.inputRef}
          setShowAnswer={props.setShowAnswer} />
      </div>
      <div className="message"><p>{text}</p></div>
      {reply()}
    </div>
  )
}