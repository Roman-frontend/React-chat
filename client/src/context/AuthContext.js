import React, {createContext, useState, useContext} from 'react'
import {useAuth} from '../hooks/auth.hook.js'

const Context = createContext()

export const useAuthContext = () => {
  return useContext(Context) 
}

export const AuthContext = ({children}) => {
  const {login, logout, changeLocalStorageUserData, userData, setUserData, name, token, userId, setUserId, ready} = useAuth()
  const [usersNames, setUsersNames] = useState([])
  const isAuthenticated = !!token

  return (
  	<Context.Provider value={{
      userData,
      setUserData,
      name, 
      token,
  	  userId,
      setUserId,
  	  login,
  	  logout,
      changeLocalStorageUserData,
      isAuthenticated, 
      usersNames, 
      setUsersNames
     }}>
      {children}
    </Context.Provider>
  )
}