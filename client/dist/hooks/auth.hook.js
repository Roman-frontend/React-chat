"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = void 0;
const react_1 = require("react");
const soket_1 = require("../WebSocket/soket");
const reactiveVars_1 = require("../GraphQLApp/reactiveVars");
const client_1 = require("@apollo/client");
const useAuth = () => {
    const channels = (0, client_1.useReactiveVar)(reactiveVars_1.reactiveVarChannels);
    const directMessagesId = (0, client_1.useReactiveVar)(reactiveVars_1.reactiveDirectMessages);
    const userId = (0, client_1.useReactiveVar)(reactiveVars_1.reactiveVarId);
    const auth = (0, react_1.useCallback)((data) => {
        (0, reactiveVars_1.reactiveVarToken)(data.token);
        (0, reactiveVars_1.reactiveVarName)(data.name);
        (0, reactiveVars_1.reactiveVarEmail)(data.email);
        (0, reactiveVars_1.reactiveVarId)(data.id);
        (0, reactiveVars_1.reactiveVarChannels)(data.channels);
        (0, reactiveVars_1.reactiveDirectMessages)(data.directMessages);
        (0, reactiveVars_1.reactiveVarPrevAuth)(data);
        const toStorage = JSON.stringify(data);
        sessionStorage.setItem('storageData', toStorage);
    }, []);
    const logout = (0, react_1.useCallback)(() => {
        if (Array.isArray(channels) && Array.isArray(directMessagesId)) {
            const userRooms = channels.concat(directMessagesId);
            (0, soket_1.wsSend)({ userRooms, userId, meta: 'leave' });
        }
        sessionStorage.clear();
        (0, reactiveVars_1.reactiveVarToken)(null);
        (0, reactiveVars_1.reactiveVarName)(null);
        (0, reactiveVars_1.reactiveVarEmail)(null);
        (0, reactiveVars_1.reactiveVarId)(null);
        (0, reactiveVars_1.reactiveVarChannels)(null);
        (0, reactiveVars_1.reactiveDirectMessages)(null);
        (0, reactiveVars_1.reactiveVarPrevAuth)({});
        (0, reactiveVars_1.activeChatId)({});
        (0, reactiveVars_1.reactiveOnlineMembers)([]);
    }, []);
    return { auth, logout };
};
exports.useAuth = useAuth;
