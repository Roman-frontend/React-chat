import React from 'react'
import {useAuthContext} from '../context/AuthContext'
import {useMessagesContext} from '../context/MessagesContext'
import Messages from './Messages'
import InputUpdateMessages from './InputUpdateMessages'
import ButtonExitChangeMessage from './ButtonExitChangeMessage'

export default function Conversation(props) {
  const {name} = useAuthContext();
  const {messages, messageActions} = useMessagesContext();
  const className = messageActions.answerTo ? "right-block-with-riply" : "right-block-without-riply";

  const fieldAnswerTo = () => {
    if (messageActions.answerTo) {
      const answerTo = messages.find(message => message._id === messageActions.answerTo);
      return <div className="field-answer"><p>{answerTo.text}</p></div>
    }
  }

  return (
    <div className={className}>
      <div className="nick-people">
        <b className="main-font sets-peoples-of-chat">
          ✩ {name}
        </b>
      </div>
      {fieldAnswerTo()}
      <Messages />
      <div className="field-for-message">
        <InputUpdateMessages />
        <ButtonExitChangeMessage />
      </div>
    </div>
  )
}