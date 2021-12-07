"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactiveVarPrevAuth = exports.reactiveOnlineMembers = exports.activeChatId = exports.reactiveVarChannels = exports.reactiveDirectMessages = exports.reactiveVarId = exports.reactiveVarEmail = exports.reactiveVarName = exports.reactiveVarToken = void 0;
const client_1 = require("@apollo/client");
const storage = JSON.parse(sessionStorage.getItem('storageData'));
exports.reactiveVarToken = storage ? (0, client_1.makeVar)(storage.token) : (0, client_1.makeVar)();
exports.reactiveVarName = storage ? (0, client_1.makeVar)(storage.name) : (0, client_1.makeVar)();
exports.reactiveVarEmail = storage ? (0, client_1.makeVar)(storage.email) : (0, client_1.makeVar)();
exports.reactiveVarId = storage ? (0, client_1.makeVar)(storage.id) : (0, client_1.makeVar)();
exports.reactiveDirectMessages = storage
    ? (0, client_1.makeVar)(storage.directMessages)
    : (0, client_1.makeVar)();
exports.reactiveVarChannels = storage
    ? (0, client_1.makeVar)(storage.channels)
    : (0, client_1.makeVar)();
exports.activeChatId = (0, client_1.makeVar)({});
exports.reactiveOnlineMembers = (0, client_1.makeVar)([]);
exports.reactiveVarPrevAuth = (0, client_1.makeVar)({});
