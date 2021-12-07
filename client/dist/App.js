"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomThemeContext = void 0;
const react_1 = __importStar(require("react"));
const styles_1 = require("@mui/material/styles");
const react_router_dom_1 = require("react-router-dom");
const routes_1 = require("./routes");
//import CustomThemeProvider from './components/Theme/CustomeThemeProvider';
const base_1 = __importDefault(require("./components/Theme/base"));
const notistack_1 = require("notistack");
require("./css/style.sass");
exports.CustomThemeContext = (0, react_1.createContext)({
    currentTheme: 'light',
    setTheme: null,
});
function App() {
    // Read current theme from localStorage or maybe from an api
    const currentTheme = localStorage.getItem('appTheme') || 'light';
    // State to hold the selected theme name
    const [themeName, _setThemeName] = (0, react_1.useState)(currentTheme);
    // Retrieve the theme object by theme name
    const theme = (0, base_1.default)(themeName);
    // Wrap _setThemeName to store new theme names in localStorage
    const setThemeName = (name) => {
        localStorage.setItem('appTheme', name);
        _setThemeName(name);
    };
    const contextValue = {
        currentTheme: themeName,
        setTheme: setThemeName,
    };
    return (<react_router_dom_1.BrowserRouter>
      <notistack_1.SnackbarProvider maxSnack={3}>
        <exports.CustomThemeContext.Provider value={contextValue}>
          <styles_1.ThemeProvider theme={theme}>
            <react_router_dom_1.Switch>{(0, routes_1.routesCreater)()}</react_router_dom_1.Switch>
          </styles_1.ThemeProvider>
        </exports.CustomThemeContext.Provider>
      </notistack_1.SnackbarProvider>
    </react_router_dom_1.BrowserRouter>);
}
exports.default = App;
