import React, { useState, createContext } from 'react';
import { ThemeProvider } from '@mui/styles';
import getTheme from './base';

// eslint-disable-next-line no-unused-vars
/* export const CustomThemeContext = createContext({
  currentTheme: 'light',
  setTheme: null,
}); */

const CustomThemeProvider = (props) => {
  // eslint-disable-next-line react/prop-types
  const { children } = props;

  console.log(children);

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

  //const strictTheme = unstable_createMuiStrictModeTheme();

  return (
    <CustomThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CustomThemeContext.Provider>
  );
};

export default CustomThemeProvider;
