"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const client_1 = require("@apollo/client");
const error_1 = require("@apollo/client/link/error");
const context_1 = require("@apollo/client/link/context");
const reactiveVars_1 = require("./reactiveVars");
//const httpLink = createHttpLink({ uri: '/graphql' });
const httpLink = new client_1.HttpLink({ uri: 'http://localhost:3000/graphql' });
const errorLink = (0, error_1.onError)(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) => console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`));
    if (networkError)
        console.log(`[Network error]: ${networkError}`);
});
const authLink = (0, context_1.setContext)((_, { headers }) => {
    const auth = JSON.parse(sessionStorage.getItem('storageData'));
    // return the headers to the context so httpLink can read them
    const token = auth && auth.token ? auth.token : '';
    return { headers: Object.assign(Object.assign({}, headers), { authorization: token }) };
});
const link = authLink.concat(httpLink);
exports.client = new client_1.ApolloClient({
    //link: authLink.concat(httpLink),
    //link: from([errorLink, httpLink]),
    link: (0, client_1.from)([errorLink, link]),
    cache: new client_1.InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    directMessagesId() {
                        return (0, reactiveVars_1.reactiveVarToken)() ? (0, reactiveVars_1.reactiveDirectMessages)() : null;
                    },
                    channels() {
                        return (0, reactiveVars_1.reactiveVarToken)() ? (0, reactiveVars_1.reactiveVarChannels)() : null;
                    },
                    token() {
                        return (0, reactiveVars_1.reactiveVarToken)();
                    },
                    name() {
                        return (0, reactiveVars_1.reactiveVarToken)() ? (0, reactiveVars_1.reactiveVarName)() : null;
                    },
                    email() {
                        return (0, reactiveVars_1.reactiveVarToken)() ? (0, reactiveVars_1.reactiveVarEmail)() : null;
                    },
                    id() {
                        return (0, reactiveVars_1.reactiveVarToken)() ? (0, reactiveVars_1.reactiveVarId)() : null;
                    },
                    usersOnline() {
                        return (0, reactiveVars_1.reactiveVarToken)() ? (0, reactiveVars_1.reactiveOnlineMembers)() : null;
                    },
                    activeChannelId() {
                        return (0, reactiveVars_1.reactiveVarToken)() ? (0, reactiveVars_1.activeChatId)().activeChannelId : null;
                    },
                    activeDirectMessageId() {
                        return (0, reactiveVars_1.reactiveVarToken)()
                            ? (0, reactiveVars_1.activeChatId)().activeDirectMessageId
                            : null;
                    },
                    activeChatId() {
                        return (0, reactiveVars_1.reactiveVarToken)()
                            ? (0, reactiveVars_1.activeChatId)().activeChannelId ||
                                (0, reactiveVars_1.activeChatId)().activeDirectMessageId
                            : null;
                    },
                    activeChatType() {
                        if ((0, reactiveVars_1.reactiveVarToken)()) {
                            if ((0, reactiveVars_1.activeChatId)().activeChannelId) {
                                return 'Channel';
                            }
                            else if ((0, reactiveVars_1.activeChatId)().activeDirectMessageId) {
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
