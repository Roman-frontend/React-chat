import React from 'react';
import { render } from 'react-dom';
import { ApolloProvider, useReactiveVar } from '@apollo/client';
import './i18n';
import App from './App.js';
import { client } from './GraphQLApp/apolloClient';
import { reactiveVarToken } from './GraphQLApp/reactiveVariables';

//цей ApolloProvider - для - apollo-client
const app = (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
render(app, document.getElementById('root'));
