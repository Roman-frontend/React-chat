import React, { useState, useRef } from 'react'
import {useSelector} from 'react-redux'
import { ConversationHeader } from '../ConversationHeader/ConversationHeader.jsx'
import { Messages } from '../Messages/Messages.jsx'
import { InputUpdateMessages } from '../InputUpdateMessages/InputUpdateMessages.jsx'
import EndActionButton from '../EndActionButton/EndActionButton.jsx'
import imageError from '../../images/error.png'
import './conversation.sass'
import { useCallback } from 'react'

export default function Conversation() {
  const userId = useSelector(state => state.login.userId)
  const channels = useSelector(state => state.channels)
  const activeChannelId = useSelector(state => state.activeChannelId)
  const [activeMessage, setActiveMessage] = useState({});
  const inputRef = useRef()

  const checkPrivate = useCallback(() => {
    if ( channels && activeChannelId ) {
      let openChannel = false
      channels.forEach(channel => {
        if ( channel._id === activeChannelId && channel.isPrivate && !channel.members.includes(userId) ) {
          return openChannel = true
        }
      }) 
      return openChannel
    }
  }, [channels, activeChannelId, userId])

  const buttonEndActive = activeMessage.reply || activeMessage.changing ? 
    <EndActionButton  
      activeMessage={activeMessage} 
      setActiveMessage={setActiveMessage} 
      inputRef={inputRef}
    /> : null;

  const contentMessages = () => { 
    const hasNotAccesToChat = checkPrivate()

    return (
      hasNotAccesToChat ? <img src={imageError} /> :
      <Messages 
        activeMessage={activeMessage} 
        setActiveMessage={setActiveMessage} 
        inputRef={inputRef}
      />
    )
  }

  const fieldAnswerTo = () => {
    if (activeMessage.reply) {
      return <div className="conversation-riply__answer">{activeMessage.reply.text}</div>
    }
  }

  return (
    <div className={ activeMessage.reply ? "conversation-riply" : "conversation" }>
      <ConversationHeader inputRef={inputRef}/>
      {fieldAnswerTo()}
      {contentMessages()}
      <div className="conversation-input">
        <InputUpdateMessages
          inputRef={inputRef}
          activeMessage={activeMessage} 
          setActiveMessage={setActiveMessage}
        />
        {buttonEndActive}
      </div>
    </div>
  )
}