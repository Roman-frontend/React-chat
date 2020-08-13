import React from 'react'
import {Chat} from '../pages/Chat.js'
import {FilterContacts} from '../pages/FilterContacts.js'
import {AddChannel} from '../pages/AddChannel'
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom'
import {useAuth} from '../hooks/auth.hook.js'

export const PrivateRoute = ({component: Component, ...rest}) => {
  const {token} = useAuth()
  const isAuthenticated = !!token
  console.log("token -", token)

  function a(routeProps) {
    if (isAuthenticated) {
      return <Component {...routeProps} />
    } else {
      return <Redirect to="/signIn" />
    }
  }

  return (
    <Route  
      {...rest}
      render={routeProps => a(routeProps)}
    />
  )
}