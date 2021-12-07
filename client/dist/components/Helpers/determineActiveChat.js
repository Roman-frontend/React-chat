"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.determineActiveChat = void 0;
function determineActiveChat(directMessage, users, authId) {
    let name;
    const friendId = directMessage.members[0] === authId
        ? directMessage.members[1]
        : directMessage.members[0];
    for (let user of users) {
        if ((user === null || user === void 0 ? void 0 : user.id) === friendId) {
            name = user.name;
        }
    }
    return name;
}
exports.determineActiveChat = determineActiveChat;
