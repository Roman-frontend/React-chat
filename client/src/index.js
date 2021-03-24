import React from 'react';
import { render } from 'react-dom';
import { compose, createStore, applyMiddleware } from 'redux';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from '@apollo/client';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { rootReducer } from './redux/reducers/rootReducer.js';
import './i18n';
import App from './App.js';

const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
  cache: new InMemoryCache({
    typePolicies: {
      //User - ім'я - схеми-UserType з бази
      User: {
        fields: {
          //name - ключ об'єкту схеми
          name: {
            read(name = 'UNKNOWN NAME', { args }) {
              if (args && typeof args.maxLength === 'number') {
                //substring повертає частину фрази починаючи з позиції 1го аргумента до позиції другого аргумента, або до кінця.
                return name.substring(0, 2);
              }
              // Return the cached name, transformed to upper case
              return name.substring(0, 2);
            },
          },
          key: {
            read(key = 'UNKNOWN NAME') {
              // Return the cached name, transformed to upper case
              return key;
            },
          },
          clientField() {
            return 'clientFieldForTest';
          },
        },
      },
    },
  }),
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
