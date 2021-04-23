import React from 'react';
import { render } from 'react-dom';
import { compose, createStore, applyMiddleware } from 'redux';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from '@apollo/client';
import {
  reactiveVarName,
  reactiveVarToken,
  reactiveVarEmail,
  reactiveVarId,
  reactiveDirectMessages,
  reactiveVarChannels,
  reactiveActiveChannelId,
  reactiveActiveDirrectMessageId,
  reactiveOnlineMembers,
} from './components/GraphQL/reactiveVariables';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { rootReducer } from './redux/reducers/rootReducer.js';
import './i18n';
import App from './App.js';

const typeDefs = gql`
  extend type Query {
    loginId: ID
  }
`;

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        directMessagesId() {
          return reactiveDirectMessages();
        },
        channels() {
          reactiveVarChannels();
          return reactiveVarChannels();
        },
        token() {
          return reactiveVarToken();
        },
        name() {
          return reactiveVarName();
        },
        email() {
          return reactiveVarEmail();
        },
        id() {
          return reactiveVarId();
        },
        usersOnline() {
          return reactiveOnlineMembers();
        },
        activeChannelId() {
          return reactiveActiveChannelId();
        },
        activeDirectMessageId() {
          return reactiveActiveDirrectMessageId();
        },
        activeChatId() {
          if (reactiveActiveChannelId()) {
            return reactiveActiveChannelId();
          } else if (reactiveActiveDirrectMessageId()) {
            return reactiveActiveDirrectMessageId();
          }
        },
        activeChatType() {
          if (reactiveActiveChannelId()) {
            return 'Channel';
          } else if (reactiveActiveDirrectMessageId()) {
            return 'DirectMessage';
          }
        },
      },
    },
    DirectMessage: {
      fields: {
        addNew: {
          read(directMessages = "Не визначене Ім'я", { variables }) {
            return directMessages;
          },
        },
      },
    },
    /* Message: {
      keyFields: ['chatType', 'chatId', ['id']],
    }, */
  },
});

const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
  typeDefs,
  cache,
  resolvers: {},
  connectToDevTools: true,
});

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

//цей ApolloProvider - для - apollo-client
const app = (
  <ApolloProvider client={client}>
    <Provider store={store}>
      <App />
    </Provider>
  </ApolloProvider>
);

render(app, document.getElementById('root'));
