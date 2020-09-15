import React, {useContext} from 'react'
import {Route, Redirect} from 'react-router-dom'
import {useAuthContext} from '../context/AuthContext.js'

export const PubliсOnlyRoute = ({component: Component, ...rest}) => {
  const {isAuthenticated} = useAuthContext()

  function assignRouteToApply(routeProps) {
    if (!isAuthenticated) {
      return <Component {...routeProps} />
    } else {
      return <Redirect to="/chat" />
    }
  }

  return (
    <Route  
      {...rest}
      render={assignRouteToApply}
    />
  )
}