import React, { useState, createContext, useCallback, useId } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./router/routes";
import getTheme from "./components/Theme/base";
import { SnackbarProvider } from "notistack";
import { ApolloProvider } from "@apollo/client";
import { client } from "./GraphQLApp/apolloClient";
import { IAppContext } from "./Context/Models/IAppContext";
import { ICustomThemeContext } from "./Context/Models/ICustomThemeContext";
import IBadge from "./Models/IBadge";
import { AppContext, CustomThemeContext } from "./Context/AppContext";
import "./css/style.sass";

export default function App() {
  const appId = useId();
  const currentTheme = localStorage.getItem("appTheme") || "light";
  const [themeName, _setThemeName] = useState(currentTheme);
  const [newMsgsBadge, setNewMsgsBadge] = useState<[] | IBadge[]>([]);
  const [modalAddPeopleIsOpen, setModalAddPeopleIsOpen] = useState(false);
  const theme = getTheme(themeName);

  const setThemeName = useCallback((name: string): void => {
    localStorage.setItem("appTheme", name);
    _setThemeName(name);
  }, []);

  const contextValue: ICustomThemeContext = {
    currentTheme: themeName,
    setTheme: setThemeName,
  };

  const appContextValue: IAppContext = {
    appId,
    newMsgsBadge,
    setNewMsgsBadge,
    modalAddPeopleIsOpen,
    setModalAddPeopleIsOpen,
  };

  return (
    <CustomThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <Router>
          <ApolloProvider client={client}>
            <SnackbarProvider maxSnack={3}>
              <AppContext.Provider value={appContextValue}>
                <AppRoutes />
              </AppContext.Provider>
            </SnackbarProvider>
          </ApolloProvider>
        </Router>
      </ThemeProvider>
    </CustomThemeContext.Provider>
  );
}
