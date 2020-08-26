import React, {createContext, useState, useContext} from 'react'
import {useAuth} from '../hooks/auth.hook.js'

const Context = createContext()

export const useAuthContext = () => {
  return useContext(Context) 
}

export const AuthContext = ({children}) => {
  const {login, logout, name, token, userId, ready} = useAuth()
  const [usersNames, setUsersNames] = useState([])
  const isAuthenticated = !!token

  return (
  	<Context.Provider value={{
      name, 
      token,
  	  userId,
  	  login,
  	  logout,
      isAuthenticated, 
      usersNames, 
      setUsersNames
     }}>
      {children}
    </Context.Provider>
  )
}