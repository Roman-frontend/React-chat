import React, {useState} from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {useRoutes} from '../routes.js'
import {useAuth} from '../hooks/auth.hook.js'
import {AuthContext} from '../context/AuthContext.js'
import {Loader} from './Loader'

export default function App() {
  const {login, logout, name, token, userId, ready} = useAuth()
  const isAuthenticated = !!token
  const routes = useRoutes(isAuthenticated)
  const [messages, setMessages] = useState([]);

  if (!ready) {
    return <Loader />
  }

  return (
  	<AuthContext.Provider value={{
  	  login, logout, name, token, userId, isAuthenticated, messages, setMessages
  	}}>
  	  <Router>
        <div>
	        {routes}
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

