import React from 'react'
import EditMessage from './EditMessage'
import '../css/OpinShareCSS.css'
import iconPeople from '../images/icon-people.png'
import iconMore from '../images/icon-more.png'

export default function Message(props) {
  const {messages, setMessages, ind} = props
  const {username, text, createdAt, id, more, editText, answer} = props.message

  function moreEdit(id, index) {
    const sli = messages.slice(0, messages.length);
    let changeMas = []
    if (sli[index].more) {
      changeMas = sli.map(i => {
        if (i.id === id) {
          i.more = !i.more 
          return i
        } else {
          return i
        }
      })
    } else changeMas = sli.map(i => {
      if (i.id === id) {
        i.more = !i.more 
        return i
      } else if (i.more) {
        i.more = !i.more
        return i
      } else {
        return i
      }
    })
    setMessages(changeMas)
  }
  console.log("Не по індексу")
  return (
    <div className="container" onClick={id, index => moreEdit(id, ind)}>
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
          fieldAnswer={props.fieldAnswer} />
      </div>
      <div className="message"><p>{text}</p></div>
    </div>
  )
}