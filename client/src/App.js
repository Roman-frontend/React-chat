import React, { useState, createContext } from 'react';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { routesCreater } from './routes';
//import CustomThemeProvider from './components/Theme/CustomeThemeProvider';
import getTheme from './components/Theme/base';
import { SnackbarProvider } from 'notistack';
import './css/style.sass';

export const CustomThemeContext = createContext({
  currentTheme: 'light',
  setTheme: null,
});

export default function App() {
  // Read current theme from localStorage or maybe from an api
  const currentTheme = localStorage.getItem('appTheme') || 'light';

  // State to hold the selected theme name
  const [themeName, _setThemeName] = useState(currentTheme);

  // Retrieve the theme object by theme name
  const theme = getTheme(themeName);

  // Wrap _setThemeName to store new theme names in localStorage
  const setThemeName = (name) => {
    localStorage.setItem('appTheme', name);
    _setThemeName(name);
  };

  const contextValue = {
    currentTheme: themeName,
    setTheme: setThemeName,
  };

  return (
    <Router>
      <SnackbarProvider maxSnack={3}>
        <CustomThemeContext.Provider value={contextValue}>
          <ThemeProvider theme={theme}>
            <Switch>{routesCreater()}</Switch>
          </ThemeProvider>
        </CustomThemeContext.Provider>
      </SnackbarProvider>
    </Router>
  );
}
