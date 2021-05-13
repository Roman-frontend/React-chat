import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import {
  reactiveVarName,
  reactiveVarToken,
  reactiveVarEmail,
  reactiveVarId,
  reactiveDirectMessages,
  reactiveVarChannels,
  reactiveOnlineMembers,
  activeChatId,
} from './reactiveVars';

const httpLink = createHttpLink({
  uri: 'http://localhost:5000/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = sessionStorage.getItem('storageData').token;
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const client = new ApolloClient({
  uri: httpLink, //authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          directMessagesId() {
            return reactiveDirectMessages();
          },
          channels() {
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
            return activeChatId().activeChannelId;
          },
          activeDirectMessageId() {
            return activeChatId().activeDirectMessageId;
          },
          activeChatId() {
            return (
              activeChatId().activeChannelId ||
              activeChatId().activeDirectMessageId
            );
          },
          activeChatType() {
            if (activeChatId().activeChannelId) {
              return 'Channel';
            } else if (activeChatId().activeDirectMessageId) {
              return 'DirectMessage';
            }
          },
        },
      },
    },
  }),
  resolvers: {},
  connectToDevTools: true,
});
