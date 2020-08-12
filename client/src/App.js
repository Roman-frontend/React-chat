import React, {useState} from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {useAuth} from './hooks/auth.hook.js'
import {AuthContext} from './context/AuthContext.js'
import {PrivateRoute} from './components/PrivateRoute.js'
import {AuthRoute} from './components/AuthRoute.js'
import {Loader} from './components/Loader'

export default function App() {
  const {login, logout, name, token, userId, ready} = useAuth()
  const isAuthenticated = !!token
  const [messages, setMessages] = useState([]);
  const [usersNames, setUsersNames] = useState([])
  let routes = isAuthenticated ? <PrivateRoute /> : <AuthRoute />;

  if (!ready) {
    return <Loader />
  }

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
        {routes}
      </Router>
    </AuthContext.Provider>
  );
}