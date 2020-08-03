import React from 'react'
import {Chat} from '../pages/Chat.js'
import {FilterContacts} from '../pages/FilterContacts.js'
import {AddChannel} from '../pages/AddChannel'
import {Switch, Route, Redirect} from 'react-router-dom'

export const PrivateRoute = isAuthenticated => {

  return (
    <Switch>
      <Route exact path="/chat" component={Chat} />
      <Route exact path="/filterContacts" component={FilterContacts} />
      <Route exact path="/addChannel" component={AddChannel} />
      <Route component={Chat} />
    </Switch>
  )
}