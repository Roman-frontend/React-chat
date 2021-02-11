import React from 'react';
import { render } from 'react-dom';
import { compose, createStore, applyMiddleware } from 'redux';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { rootReducer } from './redux/reducers/rootReducer.js';
import './i18n';
import App from './App.js';

const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
  cache: new InMemoryCache(),
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
