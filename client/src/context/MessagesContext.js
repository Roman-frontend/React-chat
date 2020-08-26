import React, {createContext, useState, useContext, useRef} from 'react'
const Context = createContext()

export const useMessagesContext = () => {
  return useContext(Context) 
}

export const MessagesContext = ({component}) => { 
  const inputRef = useRef() 
  const [messages, setMessages] = useState([]);
  const [messageActions, setMessageActions] = useState({})

  return (
    <Context.Provider value={{
      inputRef,
      messages,
      setMessages,
      messageActions,
      setMessageActions
    }}>  
      {component}  
    </Context.Provider>
  )
}