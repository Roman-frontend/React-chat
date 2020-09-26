import React from 'react'
import {Route, Redirect} from 'react-router-dom'
import {useAuthContext} from '../context/AuthContext.js'
import {MessagesContext} from '../context/MessagesContext.js'

export const PrivateRoute = ({component: Component, ...rest}) => {
  const {isAuthenticated} = useAuthContext()

  function assignRouteToApply(routeProps) {
    if (isAuthenticated) {
      return <MessagesContext component={<Component {...routeProps} />} />
    } else {
      return <Redirect to="/signIn" />
    }
  }

  return (
    <Route  
      {...rest}
      render={assignRouteToApply}
    />
  )
}