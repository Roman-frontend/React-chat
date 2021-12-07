"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_dom_1 = require("react-dom");
const client_1 = require("@apollo/client");
require("./i18n");
const App_js_1 = __importDefault(require("./App.js"));
const apolloClient_1 = require("./GraphQLApp/apolloClient");
const ErrorBoundare_jsx_1 = __importDefault(require("./components/Helpers/ErrorBoundare.jsx"));
const notistack_1 = require("notistack");
//цей ApolloProvider - для - apollo-client
const app = (<react_1.default.StrictMode>
    <client_1.ApolloProvider client={apolloClient_1.client}>
      <ErrorBoundare_jsx_1.default>
        <notistack_1.SnackbarProvider maxSnack={3} anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
    }}>
          <App_js_1.default />
        </notistack_1.SnackbarProvider>
      </ErrorBoundare_jsx_1.default>
    </client_1.ApolloProvider>
  </react_1.default.StrictMode>);
(0, react_dom_1.render)(app, document.getElementById('root'));
