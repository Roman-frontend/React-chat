import React from 'react'
import {Route, Redirect} from 'react-router-dom'
import {useSelector} from 'react-redux'

export const PrivateRoute = ({component: Component, ...rest}) => {
  const isAuthenticated = useSelector(state => state.token)

  function assignRouteToApply(routeProps) {
    //console.log(isAuthenticated)
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