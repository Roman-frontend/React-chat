import React, {createContext, useState, useContext, useRef} from 'react'
import {useAuthContext} from './AuthContext.js'
const Context = createContext()

export const useMessagesContext = () => {
  return useContext(Context) 
}

export const MessagesContext = ({component}) => { 
  const inputRef = useRef()
  const [activeChannelId, setActiveChannelId] = useState(1);
  const [dataChannels, setDataChannels] = useState(null);
  const [isBlockedInput, setIsBlockedInput] = useState(false)

  return (
    <Context.Provider value={{
      inputRef,
      activeChannelId,
      setActiveChannelId,
      dataChannels,
      setDataChannels,
      isBlockedInput,
      setIsBlockedInput
    }}>  
      {component}  
    </Context.Provider>
  )
}