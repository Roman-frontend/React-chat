import SignUpPage from './pages/SignUpPage/SignUpPage.js';
import { SignInPage } from './pages/SignInPage/SignInPage.js';
import { Chat } from './pages/Chat/Chat.js';
import { PrivateRoute } from './components/Helpers/PrivateRoute';
import { FilterContacts } from './pages/FilterContacts/FilterContacts.jsx';

export const routes = [
  {
    path: '/filterContacts',
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
    component: Chat,
  },
  {
    path: '/',
    component: Chat,
  },
];

/* export function a(path) {
  routes.find(route => )
} */
