import React from 'react'
import EditMessage from './EditMessage'
import '../css/OpinShareCSS.css'
import iconPeople from '../images/icon-people.png'
import iconMore from '../images/icon-more.png'

export default function Message(props) {
  const {messages, setMessages, ind} = props
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
    let changeMas = []
    const sli = messages.slice(0, messages.length);
    const hasReply = messages.find(i => i.reply !== false)
    if (props.message.reply) {
      debugger
      changeMas = sli.map(i => {
        if (i.reply !== false) {
          i.answer = false
          return i
        } else return i
      })
      return <div><p>{hasReply.reply}</p></div>
    } else return true
  }


  return (
    <div className="container" onClick={id => moreEdit(props.message.id)}>
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
          fieldAnswer={props.fieldAnswer}
          setShowAnswer={props.setShowAnswer} />
      </div>
      <div className="message"><p>{text}</p></div>
      {reply()}
    </div>
  )
}