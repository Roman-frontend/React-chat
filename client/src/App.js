import React, {useState} from 'react'
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom'
import {useAuth} from './hooks/auth.hook.js'
import {AuthContext} from './context/AuthContext.js'
import {PrivateRoute} from './components/PrivateRoute.js'
import {AuthRoute} from './components/AuthRoute.js'
import {Loader} from './components/Loader'
import {SignUpPage} from './pages/SignUpPage'
import {SignInPage} from './pages/SignInPage'
import {Chat} from './pages/Chat.js'
import {FilterContacts} from './pages/FilterContacts.js'
import {AddChannel} from './pages/AddChannel'

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
          <Route exact path="/signIn" component={SignInPage} />
          <Route exact path="/signUp" component={SignUpPage} />
  	      <PrivateRoute exact path="/chat" component={Chat} />
          <PrivateRoute exact path="/filterContacts" component={FilterContacts} />
          <PrivateRoute exact path="/addChannel" component={AddChannel} />
          <PrivateRoute path='/' component={Chat} />
        </Switch>
      </Router>
    </AuthContext.Provider>
  );
}

