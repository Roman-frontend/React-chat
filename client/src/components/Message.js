import React from 'react'
import {useMessagesContext} from '../context/MessagesContext'
import {useServer} from '../hooks/Server'
import iconPeople from '../images/icon-people.png'
import iconMore from '../images/icon-more.png'

export default function Message(props) {
  const {removeData} = useServer()
  const {username, text, createdAt, _id} = props.message
  const {message, activeMessage, setActiveMessage} = props
  const typeMessage = message.reply ? "container-reply" : "container"
  const replyMessage = message.reply ? <div className="reply"><p>&#8593; {message.reply}</p></div> : null

  const moreEdit = () => { 
    const changedActions = activeMessage.showActions === _id ? {showActions: undefined} : {showActions: _id}
    const object = Object.assign({}, {...activeMessage}, changedActions)
    setActiveMessage({...object})
  }

  const answerTo = () => {
    activeMessage.idMessageForAnswer === _id ? 
      setActiveMessage({idMessageForAnswer: undefined}) : 
      setActiveMessage({idMessageForAnswer: _id})
  }

  const change = () => {
    activeMessage.idMessageForChange === _id ? 
      setActiveMessage({idMessageForChange: undefined}) : 
      setActiveMessage({idMessageForChange: _id})
  }

  const onDelete = () => setActiveMessage({idMessageForDelete: _id})

  const handlerEvent = () => {
    if (activeMessage.showActions === _id) {  

      return (
        <div className="change-mes">
          <img src={iconMore} alt="icon-user" className="icon-actions" onClick={moreEdit} />
          <button className="answer-mes" onClick={answerTo} >Відповісти</button>
          <button className="edit-mes" onClick={change} >Змінити</button>
          <button className="redirect-mes">Поділитись</button>
          <button className="delete-mes" 
            onClick={onDelete}
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