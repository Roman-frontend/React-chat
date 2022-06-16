import React from "react";
import { createRoot } from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import App from "./App";
import { client } from "./GraphQLApp/apolloClient";
import ErrorBoundary from "./components/Helpers/ErrorBoundare";
import "./i18n";

const container = document.getElementById("root");
const root = createRoot(container!); // createRoot(container!) if you use TypeScript

//цей ApolloProvider - для - apollo-client
const app = (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
root.render(app);
