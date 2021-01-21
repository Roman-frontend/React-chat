import React from 'react';
import { render } from 'react-dom';
import { ApolloProvider } from '@apollo/client';
import './i18n';
import App from './App.js';
import { client } from './GraphQLApp/apolloClient';

const app = (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
render(app, document.getElementById('root'));
