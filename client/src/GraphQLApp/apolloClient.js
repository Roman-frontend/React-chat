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
  reactiveVarPrevAuth,
  activeChatId,
} from './reactiveVars';

const httpLink = createHttpLink({ uri: '/graphql' });

const authLink = setContext((_, { headers }) => {
  const auth = JSON.parse(sessionStorage.getItem('storageData'));
  // return the headers to the context so httpLink can read them
  const token = auth && auth.token ? auth.token : '';
  return { headers: { ...headers, authorization: token } };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          directMessagesId() {
            return reactiveVarToken()
              ? reactiveVarPrevAuth().directMessages
              : null;
          },
          channels() {
            return reactiveVarToken() ? reactiveVarChannels() : null;
          },
          token() {
            return reactiveVarToken();
          },
          name() {
            return reactiveVarToken() ? reactiveVarName() : null;
          },
          email() {
            return reactiveVarToken() ? reactiveVarEmail() : null;
          },
          id() {
            return reactiveVarToken() ? reactiveVarId() : null;
          },
          usersOnline() {
            return reactiveVarToken() ? reactiveOnlineMembers() : null;
          },
          activeChannelId() {
            return reactiveVarToken() ? activeChatId().activeChannelId : null;
          },
          activeDirectMessageId() {
            return reactiveVarToken()
              ? activeChatId().activeDirectMessageId
              : null;
          },
          activeChatId() {
            return reactiveVarToken()
              ? activeChatId().activeChannelId ||
                  activeChatId().activeDirectMessageId
              : null;
          },
          activeChatType() {
            if (reactiveVarToken()) {
              if (activeChatId().activeChannelId) {
                return 'Channel';
              } else if (activeChatId().activeDirectMessageId) {
                return 'DirectMessage';
              }
            }
            return null;
          },
        },
      },
    },
  }),
  resolvers: {},
  connectToDevTools: true,
});
