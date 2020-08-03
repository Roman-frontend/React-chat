import React from 'react'
import {Route, Switch} from 'react-router-dom'
import {AuthPage} from './pages/AuthPage'

export const AuthRoute = isAuthenticated => {
  return (
    <Switch>
      <Route component={AuthPage} />
    </Switch>
  )
}