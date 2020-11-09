import React, {createContext, useContext} from 'react'
import {useAuth} from '../hooks/auth.hook.js'

const Context = createContext()

export const useAuthContext = () => {
  return useContext(Context) 
}

export const AuthContext = ({children}) => {
  const {login, logout, changeLocalStorageUserData} = useAuth()

  return (
  	<Context.Provider value={{
  	  login,
  	  logout,
      changeLocalStorageUserData 
     }}>
      {children}
    </Context.Provider>
  )
}