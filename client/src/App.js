import React, {useState} from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {useRoutes} from './routes.js'
import {useAuth} from './hooks/auth.hook.js'
import {AuthContext} from './context/AuthContext.js'
import {PrivateRoute} from './components/PrivateRoute.js'
import {AuthRoute} from '.components/AuthRoute'
import {Loader} from './components/Loader'

export default function App() {
  const {login, logout, name, token, userId, ready} = useAuth()
  const isAuthenticated = !!token
  const routes = useRoutes(isAuthenticated)
  const [messages, setMessages] = useState([]);
  const [usersNames, setUsersNames] = useState([])

  if (!ready) {
    return <Loader />
  }

  let authOrNotAuthRoutes = isAuthenticated ? PrivateRoute : AuthRoute

  return (
  	<AuthContext.Provider value={{
  	  login, 
      logout, 
      name, 
      token, 
      userId, 
      isAuthenticated, 
      messages, 
      setMessages, 
      usersNames, 
      setUsersNames
  	}}>
  	  <Router>
	      {authOrNotAuthRoutes}
      </Router>
    </AuthContext.Provider>
  );
}

