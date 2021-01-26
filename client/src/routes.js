import React from 'react';
import SignUpPage from './pages/SignUpPage/SignUpPage.js';
import { SignInPage } from './pages/SignInPage/SignInPage.js';
import { Chat } from './pages/Chat/Chat.js';
import { PrivateRoute } from './components/Helpers/PrivateRoute';
import { PubliсOnlyRoute } from './components/Helpers/PubliсOnlyRoute';
import { FilterContacts } from './pages/FilterContacts/FilterContacts.jsx';
import { nanoid } from 'nanoid';

export const routes = [
  {
    path: '/filterContacts',
    private: true,
    exact: true,
    component: FilterContacts,
  },
  {
    path: '/signIn',
    exact: true,
    component: SignInPage,
  },
  {
    path: '/signUp',
    exact: true,
    component: SignUpPage,
  },
  {
    path: '/chat',
    exact: true,
    private: true,
    component: Chat,
  },
  {
    path: '/',
    component: SignInPage,
  },
];

export function routesCreater() {
  return routes.map((route) => {
    if (route.private) {
      return <PrivateRoute key={nanoid()} {...route} />;
    }
    return <PubliсOnlyRoute key={nanoid()} {...route} />;
  });
}
