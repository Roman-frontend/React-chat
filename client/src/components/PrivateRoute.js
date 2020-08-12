import React from 'react'
import {Chat} from '../pages/Chat.js'
import {FilterContacts} from '../pages/FilterContacts.js'
import {AddChannel} from '../pages/AddChannel'
import {BrowserRouter as Router, Route} from 'react-router-dom'

export const PrivateRoute = ({component, ...rest}) => {
  const Component = component;

  return (
    <Route  
      render={routeProps => (
      	<FadeIn>
      	  <Component {...routeProps} />
      	</FadeIn>
      )}
    />
  )
}