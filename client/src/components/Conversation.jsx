import React, {useState} from 'react'
import {useAuthContext} from '../context/AuthContext.js'
import {useMessagesContext} from '../context/MessagesContext.js'
import Messages from './Messages.jsx'
import InputUpdateMessages from './InputUpdateMessages.jsx'
import EndActionButton from './EndActionButton.jsx'

export default function Conversation(props) {
  const {name} = useAuthContext();
  const {messages} = useMessagesContext();
  const [activeMessage, setActiveMessage] = useState({})
  const className = activeMessage.answering ? "right-block-with-riply" : "right-block";
  const buttonEndActive = activeMessage.answering || activeMessage.changing ? 
    <EndActionButton  activeMessage={activeMessage} setActiveMessage={setActiveMessage} /> : null;

  const fieldAnswerTo = () => {
    if (activeMessage.answering) {
      return <div className="right-block__answer">{activeMessage.answering.text}</div>
    }
  }

  return (
    <div className={className}>
      <div className="right-block__field-name">
        <b className="right-block__name">✩ {name}</b>
      </div>
      {fieldAnswerTo()}
      <Messages activeMessage={activeMessage} setActiveMessage={setActiveMessage}/>
      <div className="right-block__block-input">
        <InputUpdateMessages />
        {buttonEndActive}
      </div>
    </div>
  )
}