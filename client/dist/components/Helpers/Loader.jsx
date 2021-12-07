"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthLoader = exports.Loader = void 0;
const react_1 = __importDefault(require("react"));
const system_1 = require("@mui/system");
const CircularProgress_1 = __importDefault(require("@mui/material/CircularProgress"));
const LinearProgress_1 = __importDefault(require("@mui/material/LinearProgress"));
const Loader = () => {
    const stylesAppLoader = { position: 'fixed', left: '50%', top: '50%' };
    return (<system_1.Box sx={stylesAppLoader}>
      <CircularProgress_1.default color='secondary'/>
    </system_1.Box>);
};
exports.Loader = Loader;
function AuthLoader() {
    return (<system_1.Box>
      <LinearProgress_1.default />
      <LinearProgress_1.default color='secondary'/>
    </system_1.Box>);
}
exports.AuthLoader = AuthLoader;
