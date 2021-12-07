"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PubliсOnlyRoute = void 0;
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const client_1 = require("@apollo/client");
const reactiveVars_1 = require("../../GraphQLApp/reactiveVars");
const PubliсOnlyRoute = (_a) => {
    var { component: Component } = _a, rest = __rest(_a, ["component"]);
    const sessionStorageData = JSON.parse(sessionStorage.getItem('storageData'));
    const token = (0, client_1.useReactiveVar)(reactiveVars_1.reactiveVarToken);
    function assignRouteToApply(routeProps) {
        if (!token && !sessionStorageData) {
            return <Component {...routeProps}/>;
        }
        else {
            return <react_router_dom_1.Redirect to='/chat'/>;
        }
    }
    return <react_router_dom_1.Route {...rest} render={assignRouteToApply}/>;
};
exports.PubliсOnlyRoute = PubliсOnlyRoute;
