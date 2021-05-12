import { ApolloClient, InMemoryCache } from '@apollo/client';
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

export const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
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
