import React, {createContext, useState, useContext, useRef} from 'react'
const Context = createContext()

export const useMessagesContext = () => {
  return useContext(Context) 
}

export const MessagesContext = ({component}) => {  
  const [messages, setMessages] = useState([]);
  const [messageActions, setMessageActions] = useState(null)
  const [action, setAction] = useState({})
  const inputRef = useRef()

  return (
    <Context.Provider value={{
      messages,
      setMessages,
      messageActions,
      setMessageActions,
      action,
      setAction,
      inputRef
    }}>  
      {component}  
    </Context.Provider>
  )
}