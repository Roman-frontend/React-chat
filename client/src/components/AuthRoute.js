import React from 'react'
import {Route, Switch} from 'react-router-dom'
import {SignUpPage} from '../pages/SignUpPage'
import {SignInPage} from '../pages/SignInPage'

export const AuthRoute = () => {
  return (
    <Switch>
      <Route path="/signUp" component={SignUpPage} />
      <Route component={SignInPage} />
    </Switch>
  )
}