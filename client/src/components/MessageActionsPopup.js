import React from 'react'
import {useMessagesContext} from '../context/MessagesContext'
import {useServer} from '../hooks/Server'
import iconPeople from '../images/icon-people.png'
import iconMore from '../images/icon-more.png'

export default function MessageActionsPopup(props) {
  const {removeData} = useServer()
  const { messages, inputRef } = useMessagesContext()
  const {activeMessage} = props

  const action = () => {

    if (activeMessage.idMessageForAnswer) {
      inputRef.current.value = ""

    } else if (activeMessage.idMessageForChange) {
      const messageForChange = messages.find(message => message._id === activeMessage.idMessageForChange);
      inputRef.current.value = messageForChange.text

    } else if (activeMessage.idMessageForDelete) {
      const messageForRemove = messages.find(message => message._id === activeMessage.idMessageForRemove);
      removeData(messageForRemove)
    }
  }

  return null
}