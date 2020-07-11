import React from 'react'
import {Chat} from './pages/Chat.js'
import {FilterContacts} from './pages/FilterContacts.js'
import {Switch, Route, Redirect} from 'react-router-dom'
import {AuthPage} from './pages/AuthPage'

export const useRoutes = isAuthenticated => {
  if (isAuthenticated) {
    return (
      <Switch>
        /**За шляхом /chat відкриватиметься компонент Messages*/
        <Route path="/chat" exact>
          <Chat />
        </Route>
        <Route path="/filterContacts" exact>
          <FilterContacts />
        </Route>
        /**Якщо авторизований користувач на неоприділений глях */
        <Route path="/">
          <Chat />
        </Route>
      </Switch>
    )
  }

  return (
    <Switch>
      <Route path="/" exact>
        <AuthPage />
      </Route>
      /**Якщо неавторизований користувач на неоприділений глях */
      <Redirect to="/" />
    </Switch>
  )
}