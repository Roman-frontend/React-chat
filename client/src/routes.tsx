import { Route, RouteObject } from 'react-router-dom';
import { RequireAuth } from './components/Helpers/RequireAuth.jsx';
import SignUpPage from './pages/SignUpPage/SignUpPage.js';
import { SignInPage } from './pages/SignInPage/SignInPage.js';
import { Chat } from './pages/Chat/Chat';
import MainVideoCall from './pages/MainVideoRoom/MainVideoCall.jsx';
import Room from './pages/Room/index.js';
import { nanoid } from 'nanoid';

export const routes: RouteObject[] = [
  {
    path: '/signIn',
    element: <SignInPage />,
  },
  {
    path: '/signUp',
    element: <SignUpPage />,
  },
  {
    path: '/chat',
    element: <Chat />,
  },
  {
    path: '/rooms',
    element: <MainVideoCall />,
  },
  {
    path: '/room/:id',
    element: <Room />,
  },
  {
    path: '/',
    element: <RequireAuth redirectTo='/chat' children={<SignInPage />} />,
  },
];

export function routesCreater(): JSX.Element[] {
  return routes.map((route: RouteObject) => {
    return <Route {...route} key={nanoid()} />;
  });
}
