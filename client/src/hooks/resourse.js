import { reduxServer } from './http.hook';
import {
  GET_USERS,
  GET_CHANNELS,
  GET_DIRECT_MESSAGES,
  GET_MESSAGES,
  GET_MESSAGES_FOR_DIRECT_MSG,
} from '../redux/types';

const storageData = JSON.parse(localStorage.getItem('userData'));

export function useResourse(type, token = null, param = null, body = null) {
  switch (type) {
    case GET_USERS:
      return {
        users: wrapPromise(reduxServer(`/api/channel/get-user`)),
      };

    case GET_CHANNELS:
      return {
        channels: wrapPromise(
          reduxServer(
            '/api/channel/get-chunnels',
            storageData.token,
            'POST',
            storageData.userData.channels
          )
        ),
      };

    case GET_DIRECT_MESSAGES:
      return {
        listDirectMessages: wrapPromise(
          reduxServer(
            `/api/direct-message/get-direct-messages`,
            storageData.token,
            'POST',
            { listDirectMessages: storageData.userData.directMessages }
          )
        ),
      };

    case GET_MESSAGES:
      return {
        messages: wrapPromise(reduxServer(token, param, body)),
      };

    case GET_MESSAGES_FOR_DIRECT_MSG:
      return {
        messagesOfDirectMessages: wrapPromise(reduxServer()),
      };

    default:
      return null;
  }
}

function wrapPromise(promise) {
  let status = 'pending';
  let result;

  console.log(promise);

  const suspender = promise.then(
    (r) => {
      status = 'success';
      result = r;
    },
    (e) => {
      status = 'error';
      result = e;
    }
  );
  console.log('start');
  return {
    read() {
      if (status === 'pending') {
        throw suspender;
      } else if (status === 'error') {
        throw result;
      } else if (status === 'success') {
        return result;
      }
    },
  };
}

function delay(ms) {
  return new Promise(() => {
    setTimeout(() => {
      console.log('end');
    }, ms);
  });
}
