import React from 'react';
import SignUpPage from './pages/SignUpPage/SignUpPage.js';
import { SignInPage } from './pages/SignInPage/SignInPage.js';
import { Chat } from './pages/Chat/Chat.js';
import { PrivateRoute } from './components/Helpers/PrivateRoute';
import { PubliсOnlyRoute } from './components/Helpers/PubliсOnlyRoute';
import { FilterContacts } from './pages/FilterContacts/FilterContacts.jsx';

export const routes = [
  {
    component: PubliсOnlyRoute,
    routes: [
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
        path: '/',
        exact: true,
        component: SignInPage,
      },
    ],
  },
  {
    component: PrivateRoute,
    routes: [
      {
        path: '/app/chat',
        exact: true,
        component: Chat,
      },
      {
        path: '/app/filterContacts',
        exact: true,
        component: FilterContacts,
      },
    ],
  },
];

export function routesCreater() {
  const componentsRoutes = routes.map((route, i) => {
    const Component = route.component;
    if (!route.routes) {
      return <Component key={i} {...route} />;
    }
    const childRoutes = [];
    route.routes.forEach((childRoute) => {
      childRoutes.push(<Component key={childRoute.path} {...childRoute} />);
    });
    return childRoutes;
  });
  return componentsRoutes.flat();
}
