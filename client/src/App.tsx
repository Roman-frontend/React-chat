import React, { useState, createContext, useCallback } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./router/routes";
import getTheme from "./components/Theme/base";
import { SnackbarProvider } from "notistack";
import { ApolloProvider } from "@apollo/client";
import { client } from "./GraphQLApp/apolloClient";
import "./css/style.sass";

type SetThemeType = (name: string) => void;

interface Context {
  currentTheme: string;
  setTheme: SetThemeType | null;
}

export const CustomThemeContext = createContext<Context>({
  currentTheme: "light",
  setTheme: null,
});

export default function App() {
  const currentTheme = localStorage.getItem("appTheme") || "light";
  const [themeName, _setThemeName] = useState(currentTheme);
  const theme = getTheme(themeName);

  const setThemeName = useCallback((name: string): void => {
    localStorage.setItem("appTheme", name);
    _setThemeName(name);
  }, []);

  const contextValue: Context = {
    currentTheme: themeName,
    setTheme: setThemeName,
  };

  return (
    <CustomThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <Router>
          <ApolloProvider client={client}>
            <SnackbarProvider maxSnack={3}>
              <AppRoutes />
            </SnackbarProvider>
          </ApolloProvider>
        </Router>
      </ThemeProvider>
    </CustomThemeContext.Provider>
  );
}
