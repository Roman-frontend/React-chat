import React, {useState} from 'react'
import {useAuthContext} from '../context/AuthContext'
import {useMessagesContext} from '../context/MessagesContext'
import Messages from './Messages'
import InputUpdateMessages from './InputUpdateMessages'
import EndActionButton from './EndActionButton'

export default function Conversation(props) {
  const {name} = useAuthContext();
  const {messages} = useMessagesContext();
  const [activeMessage, setActiveMessage] = useState({})
  const className = activeMessage.answering ? "right-block-with-riply" : "right-block-without-riply";
  const buttonEndActive = activeMessage.answering || activeMessage.changing ? 
    <EndActionButton  activeMessage={activeMessage} setActiveMessage={setActiveMessage} /> : null;

  const fieldAnswerTo = () => {
    if (activeMessage.answering) {
      return <div className="field-answer">{activeMessage.answering.text}</div>
    }
  }

  return (
    <div className={className}>
      <div className="nick-people">
        <b className="main-font sets-peoples-of-chat">✩ {name}</b>
      </div>
      {fieldAnswerTo()}
      <Messages activeMessage={activeMessage} setActiveMessage={setActiveMessage}/>
      <div className="field-for-message">
        <InputUpdateMessages />
        {buttonEndActive}
      </div>
    </div>
  )
}