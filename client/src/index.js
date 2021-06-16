import React from 'react';
import { render } from 'react-dom';
import { ApolloProvider, useReactiveVar } from '@apollo/client';
import './i18n';
import App from './App.js';
import { client } from './GraphQLApp/apolloClient';
import { ErrorBoundary } from './components/Helpers/ErrorBoundare';
import { SnackbarProvider } from 'notistack';

//цей ApolloProvider - для - apollo-client
const app = (
  <ApolloProvider client={client}>
    <ErrorBoundary>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <App />
      </SnackbarProvider>
    </ErrorBoundary>
  </ApolloProvider>
);
render(app, document.getElementById('root'));
