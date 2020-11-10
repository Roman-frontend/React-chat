import React from 'react'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import {PrivateRoute} from './components/Helpers/PrivateRoute.jsx'
import {PubliсOnlyRoute} from './components/Helpers/PubliсOnlyRoute.jsx'
import {SignUpPage} from './pages/SignUpPage/SignUpPage.js'
import {SignInPage} from './pages/SignInPage/SignInPage.js'
import {Chat} from './pages/Chat/Chat.js'
import {FilterContacts} from './pages/FilterContacts/FilterContacts.jsx'
import {Test} from './components/Test/Test.jsx'
import './css/style.sass'

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/test' component={Test} />
        <Route exact path='/filterContacts' component={FilterContacts} />
        <PubliсOnlyRoute exact path="/signIn" component={SignInPage} />
        <PubliсOnlyRoute exact path="/signUp" component={SignUpPage} />
        <PrivateRoute exact path="/chat" component={Chat} />
        <PrivateRoute path='/' component={Chat} />
      </Switch>
    </Router>
  );
}