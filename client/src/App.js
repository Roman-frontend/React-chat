import React from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import {useAuth} from './hooks/auth.hook.js'
import {AuthContext} from './context/AuthContext.js'
import {PrivateRoute} from './components/PrivateRoute.js'
import {PubliсOnlyRoute} from './components/PubliсOnlyRoute.js'
import {Loader} from './components/Loader'
import {SignUpPage} from './pages/SignUpPage'
import {SignInPage} from './pages/SignInPage'
import {Chat} from './pages/Chat.js'
import {FilterContacts} from './pages/FilterContacts.js'
import {AddChannel} from './pages/AddChannel'

export default function App() {
  const {ready} = useAuth()

  if (!ready) return <Loader />

  return (
  	<AuthContext>
  	  <Router>
        <Switch>
          <Route exact path='/filterContacts' component={FilterContacts} />
          <PubliсOnlyRoute exact path="/signIn" component={SignInPage} />
          <PubliсOnlyRoute exact path="/signUp" component={SignUpPage} />
  	      <PrivateRoute exact path="/chat" component={Chat} />
          <PrivateRoute exact path="/addChannel" component={AddChannel} />
          <PrivateRoute path='/' component={Chat} />
        </Switch>
      </Router>
    </AuthContext>
  );
}