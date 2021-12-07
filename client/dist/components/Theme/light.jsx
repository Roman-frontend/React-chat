"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const styles_1 = require("@mui/material/styles");
const colors_1 = require("@mui/material/colors");
const theme = (0, styles_1.createTheme)({
    palette: {
        background: {
            paper: '#f5f5f5',
            default: '#ffffff',
        },
        mode: 'light',
        primary: {
            light: '#ffffff',
            main: '#f5f5f5',
            dark: '#c9c9c9',
            contrastText: '#0000b5',
        },
        secondary: {
            main: '#000000',
            contrastText: '#FFFFFF',
        },
        input: {
            main: '#000000',
            contrastText: '#FFFFFF',
        },
        leftBarItem: {
            light: '#ffffff',
            main: '#000000',
            contrastText: '#ffffff',
        },
        error: {
            main: '#ff0000',
            contrastText: colors_1.red[100],
        },
        text: {
            primary: '#000000',
            secondary: '#000000',
            select: '#0000b5',
            disabled: colors_1.grey[500],
        },
        action: {
            active: '#0000b5',
            hover: '#c9c9c9',
            hoverOpacity: 0.5,
            selected: '#0000b5',
            focus: colors_1.red[400],
            focusOpacity: colors_1.grey[900],
            activatedOpacity: 0.3,
        },
        tonalOffset: 0.1,
        contrastThreshold: 8,
    },
    shape: {
        borderRadius: 7,
    },
    typography: {
        caption: {
            fontWeight: 600,
        },
    },
    //Зміна кольору тексту кнопки
    /* overrides: {
      MuiButton: {
        label: {
          color: '#f1f1f1',
        },
      },
    }, */
    /* components: {
      MuiListItem: {
        styleOverrides: {
          selected: {
            backgroundColor: 'red',
            color: 'black',
          },
        },
      },
    }, */
});
exports.default = theme;
