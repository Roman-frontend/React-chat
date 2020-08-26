import React, {useContext} from 'react'
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom'
import {useAuthContext} from '../context/AuthContext'

export const PrivateRoute = ({component: Component, ...rest}) => {
  const {isAuthenticated} = useAuthContext()

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