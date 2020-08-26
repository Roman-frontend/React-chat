import React, {useEffect, useMemo} from 'react'
import {useAuthContext} from '../context/AuthContext'
import {useMessagesContext} from '../context/MessagesContext'
import Message from './Message'
import ButtonExitChangeMessage from './ButtonExitChangeMessage'
import InputUpdateMessages from './InputUpdateMessages'


export default function Messages(props) {
  const {messages, setMessages, showAnswer, action, setAction} = useMessagesContext()
  const {name} = useAuthContext()
  const blockForChat = action.answerTo ? "right-block-with-riply" : "right-block-without-riply";
  
  const fieldAnswerTo = () => {
    if (action.answerTo) {
      const answerTo = messages.find(message => message._id === action.answerTo);
      return <div className="field-answer"><p>{answerTo.text}</p></div>
    }
  }

  function renderMessages() {
    return messages.map((message) => {
      return <Message key={message._id} message={message} />
    })
  }

  return (
    <div className={blockForChat}>
      <div className="nick-people">
        <b className="main-font sets-peoples-of-chat">
          ✩ {name}
        </b>
      </div>
      <div className="chat-with-people">
        {renderMessages()}
      </div>
      {fieldAnswerTo()}
      <div className="field-for-message">
        <InputUpdateMessages />
        <ButtonExitChangeMessage />
      </div>
    </div>
  )
}