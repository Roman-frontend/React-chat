import React from 'react';
import { render } from 'react-dom';
import { ApolloProvider } from '@apollo/client';
import './i18n';
import App from './App';
import { client } from './GraphQLApp/apolloClient';
import ErrorBoundary from './components/Helpers/ErrorBoundare';
import { SnackbarProvider } from 'notistack';

//цей ApolloProvider - для - apollo-client
const app = (
  <React.StrictMode>
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
  </React.StrictMode>
);
render(app, document.getElementById('root'));
