'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.routesCreater = exports.routes = void 0;
const react_1 = __importDefault(require('react'));
const SignUpPage_js_1 = __importDefault(
  require('./pages/SignUpPage/SignUpPage.js')
);
const SignInPage_js_1 = require('./pages/SignInPage/SignInPage.js');
const Chat_js_1 = require('./pages/Chat/Chat');
const PrivateRoute_1 = require('./components/Helpers/PrivateRoute');
const Publi_OnlyRoute_1 = require('./components/Helpers/Publi\u0441OnlyRoute');
const nanoid_1 = require('nanoid');
exports.routes = [
  {
    path: '/signIn',
    exact: true,
    component: SignInPage_js_1.SignInPage,
  },
  {
    path: '/signUp',
    exact: true,
    component: SignUpPage_js_1.default,
  },
  {
    path: '/chat',
    exact: true,
    private: true,
    component: Chat_js_1.Chat,
  },
  {
    path: '/',
    component: SignInPage_js_1.SignInPage,
  },
];
function routesCreater() {
  return exports.routes.map((route) => {
    if (route.private) {
      return (
        <PrivateRoute_1.PrivateRoute key={(0, nanoid_1.nanoid)()} {...route} />
      );
    }
    return (
      <Publi_OnlyRoute_1.PubliсOnlyRoute
        key={(0, nanoid_1.nanoid)()}
        {...route}
      />
    );
  });
}
exports.routesCreater = routesCreater;
