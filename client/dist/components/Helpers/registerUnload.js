"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerOfflineUser = exports.registerUnloadPage = exports.registerOnlineUser = exports.registerEnterPage = void 0;
const soket_1 = require("../../WebSocket/soket");
const reactiveVars_1 = require("../../GraphQLApp/reactiveVars");
function online() {
    soket_1.wsSingleton.clientPromise
        .then((wsClient) => console.log('ONLINE'))
        .catch((error) => console.log(error));
    const storage = JSON.parse(sessionStorage.getItem('storageData'));
    if (storage && storage.channels && storage.directMessages) {
        const allUserChats = storage.channels.concat(storage.directMessages);
        (0, soket_1.wsSend)({ userRooms: allUserChats, meta: 'join', userId: storage.id });
    }
}
function registerEnterPage() {
    //console.info(performance.navigation.type);
    console.log('registerEnterPage');
    if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
        online();
        //console.info('This page is reloaded');
    }
    else if (window.performance) {
        //check for Navigation Timing API support
        console.info('window.performance works fine on this browser');
        online();
    }
    else {
        //console.info('This page is not reloaded');
    }
}
exports.registerEnterPage = registerEnterPage;
function registerOnlineUser(usersOnline) {
    console.log('registerOnlineUser');
    return soket_1.wsSingleton.clientPromise
        .then((wsClient) => {
        wsClient.addEventListener('message', (response) => {
            const parsedRes = JSON.parse(response.data);
            if (parsedRes.message === 'online' &&
                JSON.stringify(usersOnline) !== JSON.stringify(parsedRes.members)) {
                (0, reactiveVars_1.reactiveOnlineMembers)(parsedRes.members);
            }
        });
    })
        .catch((error) => console.log(error));
}
exports.registerOnlineUser = registerOnlineUser;
function registerUnloadPage(msg, onunloadFunc) {
    console.log('registerUnloadPage');
    let alreadPrompted = false, timeoutID = 0, reset = function () {
        alreadPrompted = false;
        timeoutID = 0;
    };
    if (msg || onunloadFunc) {
        // register
        window.onbeforeunload = function () {
            if (msg && !alreadPrompted) {
                alreadPrompted = true;
                timeoutID = setTimeout(reset, 100);
                return msg;
            }
        };
        window.onunload = function () {
            clearTimeout(timeoutID);
            if (onunloadFunc)
                onunloadFunc();
        };
    }
    else {
        // unregister
        window.onbeforeunload = null;
        window.onunload = null;
    }
}
exports.registerUnloadPage = registerUnloadPage;
function registerOfflineUser() {
    console.log('registerOfflineUser');
    const storageData = JSON.parse(sessionStorage.getItem('storageData'));
    if (storageData && storageData.channels[0]) {
        const allUserChats = storageData.channels.concat(storageData.directMessages);
        (0, soket_1.wsSend)({
            userRooms: allUserChats,
            userId: storageData.id,
            meta: 'leave',
            path: 'Conversation',
        });
    }
}
exports.registerOfflineUser = registerOfflineUser;
