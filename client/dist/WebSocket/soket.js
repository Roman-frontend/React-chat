"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsSingleton = exports.wsSend = void 0;
class Ws extends Object {
    get newClientPromise() {
        return new Promise((resolve, reject) => {
            let wsClient = new WebSocket('ws://localhost:8080');
            wsClient.onopen = () => {
                resolve(wsClient);
            };
            wsClient.onerror = (error) => {
                reject(error);
            };
        });
    }
    get clientPromise() {
        let stompClientPromise = this.stompClientPromise;
        if (!stompClientPromise)
            stompClientPromise = this.newClientPromise;
        this.stompClientPromise = stompClientPromise;
        return stompClientPromise;
    }
}
function wsSend(data) {
    exports.wsSingleton.clientPromise
        .then((wsClient) => {
        wsClient.send(JSON.stringify(data));
    })
        .catch((error) => console.log(error));
}
exports.wsSend = wsSend;
exports.wsSingleton = new Ws();
