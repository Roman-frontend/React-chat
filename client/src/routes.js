import React from 'react'
import {Chat} from './pages/Chat.js'
import {FilterContacts} from './pages/FilterContacts.js'
import WorkSpace from './pages/WorkSpace.js'
import {Switch, Route, Redirect} from 'react-router-dom'
import {AuthPage} from './pages/AuthPage'

export const useRoutes = isAuthenticated => {
  if (isAuthenticated) {
    return (
      <Switch>
        <Route exact path="/chat" >
          <Chat />
        </Route>
        <Route exact path="/filterContacts" >
          <FilterContacts />
        </Route>
        <Route component={Chat} />
      </Switch>
    )
  }

  return (
    <Switch>
      <Route path="/" exact>
        <AuthPage />
      </Route>
      <Route component={AuthPage} />
    </Switch>
  )
}