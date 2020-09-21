import React, {createContext, useState, useContext, useRef} from 'react'
import {useAuthContext} from './AuthContext.js'
const Context = createContext()

export const useMessagesContext = () => {
  return useContext(Context) 
}

export const MessagesContext = ({component}) => { 
  const {userId} = useAuthContext()
  const inputRef = useRef() 
  const [messages, setMessages] = useState([]);
  const [messageActions, setMessageActions] = useState({})
  const [activeChannelId, setActiveChannelId] = useState(userId);
  console.log(activeChannelId)

  return (
    <Context.Provider value={{
      inputRef,
      messages,
      setMessages,
      messageActions,
      setMessageActions,
      activeChannelId,
      setActiveChannelId
    }}>  
      {component}  
    </Context.Provider>
  )
}