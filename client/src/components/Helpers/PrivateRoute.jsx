import React from 'react'
import {Route, Redirect} from 'react-router-dom'
import {useSelector} from 'react-redux'

export const PrivateRoute = ({component: Component, ...rest}) => {
  const isAuthenticated = useSelector(state => state.login)

  function assignRouteToApply(routeProps) {
    if (isAuthenticated) {
      return <Component {...routeProps} />
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