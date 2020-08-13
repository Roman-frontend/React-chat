import React, {useContext} from 'react'
import {Route, Redirect} from 'react-router-dom'
import {AuthContext} from '../context/AuthContext'

export const PubliсOnlyRoute = ({component: Component, ...rest}) => {
  const {isAuthenticated} = useContext(AuthContext)

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