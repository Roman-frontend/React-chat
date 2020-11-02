import React, { useState, useEffect } from 'react'
import {useAuthContext} from '../../context/AuthContext.js'
import {useMessagesContext} from '../../context/MessagesContext.js'
import { ConversationHeader } from '../ConversationHeader/ConversationHeader.jsx'
import Messages from '../Messages/Messages.jsx'
import { InputUpdateMessages } from '../InputUpdateMessages/InputUpdateMessages.jsx'
import EndActionButton from '../EndActionButton/EndActionButton.jsx'
import imageError from '../../images/error.png'
import './conversation.sass'

export default function Conversation(props) {
  const {userId } = useAuthContext();
  const { activeChannelId, dataChannels, isBlockedInput } = useMessagesContext()
  const [activeMessage, setActiveMessage] = useState({});
  const buttonEndActive = activeMessage.reply || activeMessage.changing ? 
    <EndActionButton  activeMessage={activeMessage} setActiveMessage={setActiveMessage} /> : null;
  const contentMessages = isBlockedInput ? <img src={imageError} /> :
    <Messages activeMessage={activeMessage} setActiveMessage={setActiveMessage} />;

//НЕ ВИДАЛЯТИ перевіряє чи активний канал не закритий для юзера
/*  const [ channelIsAvailableForUser, setChannelIsAvailableForUser ] = useState(true)
  useEffect(() => {
    if ( dataChannels && activeChannelId ) {
      dataChannels.forEach(channel => {
        if ( channel._id === activeChannelId && channel.isPrivate && !channel.members.includes(userId) ) {
          setChannelIsAvailableForUser(false)

        } else setChannelIsAvailableForUser(true)
      }) 
    }
  }, [dataChannels, activeChannelId, userId])*/

  const fieldAnswerTo = () => {
    if (activeMessage.reply) {
      return <div className="conversation-riply__answer">{activeMessage.reply.text}</div>
    }
  }

  return (
    <div className={ activeMessage.reply ? "conversation-riply" : "conversation" }>
      <ConversationHeader />
      {fieldAnswerTo()}
      {contentMessages}
      <div className="conversation-input">
        <InputUpdateMessages
          activeMessage={activeMessage} 
          setActiveMessage={setActiveMessage}
        />
        {buttonEndActive}
      </div>
    </div>
  )
}