"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const styles_1 = require("@mui/material/styles");
const colors_1 = require("@mui/material/colors");
const theme = (0, styles_1.createTheme)({
    palette: {
        background: {
            paper: colors_1.yellow[100], //brown[800],
        },
        type: 'dark',
        primary: {
            light: '#737373',
            main: '#272738',
            dark: '#090912',
            contrastText: colors_1.yellow[100],
        },
        secondary: {
            light: '#090912',
            dark: '#ffffff',
            main: colors_1.yellow[100],
            contrastText: colors_1.green[100],
        },
        error: {
            main: colors_1.red[500],
            contrastText: '#ffffff',
        },
        input: {
            main: '#ffffff',
            contrastText: '#ffffff',
        },
        leftBarItem: {
            light: '#ffffff',
            main: '#ffffff',
            contrastText: '#000000',
        },
        text: {
            primary: '#FFFFFF',
            secondary: '#FFFFFF',
            select: '#090912',
            disabled: colors_1.grey[100],
        },
        //#37374f
        action: {
            active: colors_1.yellow[100],
            hover: '#131329',
            hoverOpacity: 0.5,
            selected: colors_1.yellow[100],
        },
        tonalOffset: 0.1,
    },
    shape: {
        borderRadius: 7,
    },
});
exports.default = theme;
