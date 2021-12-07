import React, { Component, ReactNode, ComponentType } from 'react';
import SignUpPage from './pages/SignUpPage/SignUpPage.js';
import { SignInPage } from './pages/SignInPage/SignInPage.js';
import { Chat } from './pages/Chat/Chat.js';
import { PrivateRoute } from './components/Helpers/PrivateRoute';
import { PubliсOnlyRoute } from './components/Helpers/PubliсOnlyRoute';
import { nanoid } from 'nanoid';

type Props = any;

//type ReturnedRoute = ({ ...route }: Route) => any;

interface Route {
  path: string;
  exact?: boolean;
  private?: boolean;
  component: ComponentType<Props>;
}

export const routes: Route[] = [
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

export function routesCreater(): JSX.Element[] {
  return routes.map((route: Route) => {
    if (route.private) {
      return <PrivateRoute key={nanoid()} {...route} />;
    }
    return <PubliсOnlyRoute key={nanoid()} {...route} />;
  });
}
