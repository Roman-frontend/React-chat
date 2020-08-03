import React from 'react'
import {Chat} from './pages/Chat.js'
import {Route, Switch} from 'react-router-dom'
import {AuthPage} from './pages/AuthPage'
import {PrivateRoute} from './components/PrivateRoute.js'

export const useRoutes = isAuthenticated => {
  return (
    <Switch>
      <Route exact path="/" component={isAuthenticated ? Chat : AuthPage} />
      <Route path="/" component={PrivateRoute} />
    </Switch>
  )
}

/*  return (
    <Switch>
      <Route exact path="/chat" component={PrivateRoute} />
      <Route exact path="/chat" component={Chat} />
      <Route exact path="/filterContacts" component={FilterContacts} />
      <Route exact path="/addChannel" component={AddChannel} />
      <Route exact path="/" component={AuthPage} />
      <Route component={AuthPage} />
    </Switch>
  )
}*/