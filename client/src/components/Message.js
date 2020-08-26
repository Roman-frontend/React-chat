import React, {useEffect, useMemo, useCallback, useState} from 'react'
import {useMessagesContext} from '../context/MessagesContext'
import {useServer} from '../hooks/Server'
import iconPeople from '../images/icon-people.png'
import iconMore from '../images/icon-more.png'

export default function Message(props) {
  const {removeData} = useServer()
  const {
    messages, 
    setMessages,
    messageActions,
    setMessageActions,
    inputRef, 
    action, 
    setAction,
  } = useMessagesContext()
  const {username, text, createdAt, _id} = props.message
  const {message} = props
  let typeMessage = message.reply ? "container-reply" : "container"
  const replyMessage = message.reply ? <div className="reply"><p>&#8593; {message.reply}</p></div> : null

  const moreEdit = () => { 
    if (messageActions) { setMessageActions(null) 
    } else if (!messageActions) setMessageActions(_id) 
  }

  const answerTo = () => {
    setMessageActions(null)
    const objListAction = action.answerTo === _id ? {'answerTo': null} : {'answerTo': _id}
    let object = Object.assign({}, {...action}, objListAction)
    setAction({...object})
    inputRef.current.value = ""
  }

  function change() {
    const objListAction = action.change === _id ? {'change': null} : {'change': _id}
    let object = Object.assign({}, {...action}, objListAction)
    setAction({...object})
    setMessageActions(null)
    inputRef.current.value = message.text
  }

  const handlerEvent = () => {
    if (messageActions === _id) {  
      return (
        <div className="change-mes">
          <button className="answer-mes" onClick={answerTo} >Відповісти</button>
          <button className="edit-mes" onClick={change} >Змінити</button>
          <button className="redirect-mes">Поділитись</button>
          <button className="delete-mes" 
            onClick={message => removeData(props.message)}
          >Видалити</button>
        </div>
      )
    } 
    return <img src={iconMore} alt="icon-user"/>
  }


  return (
    <div className={typeMessage} onClick={moreEdit}>
      <div className="icon"><img src={iconPeople} alt="icon-user"/></div>
      <div className="messager">{username}</div>
      <div className="date">{createdAt}</div>
      <div className="more">{handlerEvent()}</div>
      <div className="message">{text}</div>
      {replyMessage}
    </div>
  )
}