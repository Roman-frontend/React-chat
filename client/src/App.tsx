import React, { useState, createContext } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { routesCreater } from './routes';
//import CustomThemeProvider from './components/Theme/CustomeThemeProvider';
import getTheme from './components/Theme/base';
import { SnackbarProvider } from 'notistack';
import './css/style.sass';

type SetThemeType = (name: string) => void;

interface Context {
  currentTheme: string;
  setTheme: SetThemeType | null;
}

export const CustomThemeContext = createContext<Context>({
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
  const setThemeName = (name: string): void => {
    localStorage.setItem('appTheme', name);
    _setThemeName(name);
  };

  const contextValue: Context = {
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
