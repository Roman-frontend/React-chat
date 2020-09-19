import React, {useState} from 'react'
import {useAuthContext} from '../../context/AuthContext.js'
import {useMessagesContext} from '../../context/MessagesContext.js'
import Messages from '../Messages/Messages.jsx'
import InputUpdateMessages from '../InputUpdateMessages/InputUpdateMessages.jsx'
import EndActionButton from '../EndActionButton/EndActionButton.jsx'
import './conversation.sass'

export default function Conversation(props) {
  const {name} = useAuthContext();
  const {messages} = useMessagesContext();
  const [activeMessage, setActiveMessage] = useState({})
  const className = activeMessage.reply ? "conversation-riply" : "conversation";
  const buttonEndActive = activeMessage.reply || activeMessage.changing ? 
    <EndActionButton  activeMessage={activeMessage} setActiveMessage={setActiveMessage} /> : null;

  const fieldAnswerTo = () => {
    if (activeMessage.reply) {
      return <div className="conversation-riply__answer">{activeMessage.reply.text}</div>
    }
  }

  return (
    <div className={className}>
      <div className={`${className}__field-name`}>
        <b className={`${className}__name`}>✩ {name}</b>
      </div>
      {fieldAnswerTo()}
      <Messages activeMessage={activeMessage} setActiveMessage={setActiveMessage}/>
      <div className="conversation-input">
        <InputUpdateMessages activeMessage={activeMessage} setActiveMessage={setActiveMessage}/>
        {buttonEndActive}
      </div>
    </div>
  )
}