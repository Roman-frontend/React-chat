import React from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import {useAuth} from './hooks/auth.hook.js'
import {AuthContext} from './context/AuthContext.js'
import {PrivateRoute} from './components/PrivateRoute.jsx'
import {PubliсOnlyRoute} from './components/PubliсOnlyRoute.jsx'
import {Loader} from './components/Loader.jsx'
import {SignUpPage} from './pages/SignUpPage.js'
import {SignInPage} from './pages/SignInPage.js'
import {Chat} from './pages/Chat.js'
import {FilterContacts} from './pages/FilterContacts.js'
import {AddChannel} from './pages/AddChannel.js'
import './css/style.sass'

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