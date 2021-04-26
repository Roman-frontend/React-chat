import React from 'react';
import { render } from 'react-dom';
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
  },
});

const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
  typeDefs,
  cache,
  resolvers: {},
  connectToDevTools: true,
});

const app = (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

render(app, document.getElementById('root'));
