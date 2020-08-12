import React, {useState} from 'react'
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom'
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
        <Switch>
  	      <PrivateRoute path="/chat" component={Chat} />
          <PrivateRoute path="/filterContacts" component={FilterContacts} />
          <PrivateRoute path="/addChannel" component={AddChannel} />
          <Route path='/chat' component={Chat} />
        </Switch>
      </Router>
    </AuthContext.Provider>
  );
}

