import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./router/routes";
import { SnackbarProvider } from "notistack";
import { ApolloProvider } from "@apollo/client";
import { client } from "./GraphQLApp/apolloClient";
import { IAppContext } from "./Context/Models/IAppContext";
import IBadge from "./Models/IBadge";
import { AppContext } from "./Context/AppContext";
import "./css/style.sass";

export default function App() {
  const [newMsgsBadge, setNewMsgsBadge] = useState<[] | IBadge[]>([]);
  const [modalAddPeopleIsOpen, setModalAddPeopleIsOpen] = useState(false);

  const appContextValue: IAppContext = {
    newMsgsBadge,
    setNewMsgsBadge,
    modalAddPeopleIsOpen,
    setModalAddPeopleIsOpen,
  };

  return (
    <Router>
      <ApolloProvider client={client}>
        <SnackbarProvider maxSnack={3}>
          <AppContext.Provider value={appContextValue}>
            <AppRoutes />
          </AppContext.Provider>
        </SnackbarProvider>
      </ApolloProvider>
    </Router>
  );
}
