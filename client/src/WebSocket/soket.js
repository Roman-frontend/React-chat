class Ws extends Object {
  get newClientPromise() {
    return new Promise((resolve, reject) => {
      let wsClient = new WebSocket('ws://localhost:8080');
      console.log(wsClient);
      wsClient.onopen = () => {
        console.log('connected');
        resolve(wsClient);
      };
      wsClient.onerror = (error) => {
        reject(error);
      };
    });
  }
  get clientPromise() {
    let stompClientPromise = this.stompClientPromise;
    if (!stompClientPromise) stompClientPromise = this.newClientPromise;
    this.stompClientPromise = stompClientPromise;
    return stompClientPromise;
  }
}

export function wsSend(data) {
  wsSingleton.clientPromise
    .then((wsClient) => {
      wsClient.send(JSON.stringify(data));
      console.log('sended');
    })
    .catch((error) => console.log(error));
}

export const wsSingleton = new Ws();
