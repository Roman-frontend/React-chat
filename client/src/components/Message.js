import React from 'react'
import {useMessagesContext} from '../context/MessagesContext'
import {useServer} from '../hooks/Server'
import iconPeople from '../images/icon-people.png'
import iconMore from '../images/icon-more.png'

export default function Message(props) {
  const {removeData} = useServer()
  const { messageActions, setMessageActions, inputRef } = useMessagesContext()
  const {username, text, createdAt, _id} = props.message
  const {message} = props
  let typeMessage = message.reply ? "container-reply" : "container"
  const replyMessage = message.reply ? <div className="reply"><p>&#8593; {message.reply}</p></div> : null

  const moreEdit = () => { 
    if (messageActions.messageActions === _id) { 
      const object = Object.assign({}, {...messageActions}, {messageActions: null})
      setMessageActions(object) 

    } else {
      const object = Object.assign({}, {...messageActions}, {messageActions: _id})
      setMessageActions(object) 
    }
  }

  const answerTo = () => {
    const object = Object.assign({}, {...messageActions}, {answerTo: _id}, {messageActions: null})
    setMessageActions({...object})
    inputRef.current.value = ""
  }

  function change() {
    const object = Object.assign({}, {...messageActions}, {change: _id}, {messageActions: null})
    setMessageActions({...object})
    inputRef.current.value = message.text
  }

  const handlerEvent = () => {
    if (messageActions.messageActions === _id) {  

      return (
        <div className="change-mes">
          <img src={iconMore} alt="icon-user" className="icon-actions" onClick={moreEdit} />
          <button className="answer-mes" onClick={answerTo} >Відповісти</button>
          <button className="edit-mes" onClick={change} >Змінити</button>
          <button className="redirect-mes">Поділитись</button>
          <button className="delete-mes" 
            onClick={message => removeData(props.message)}
          >Видалити</button>
        </div>
      )
    } 

    return <img src={iconMore} alt="icon-user" onClick={moreEdit} />
  }


  return (
    <div className={typeMessage} >
      <div className="icon"><img src={iconPeople} alt="icon-user"/></div>
      <div className="messager">{username}</div>
      <div className="date">{createdAt}</div>
      <div className="more">
        {handlerEvent()}
      </div>
      <div className="message">{text}</div>
      {replyMessage}
    </div>
  )
}