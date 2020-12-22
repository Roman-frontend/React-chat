import { reduxServer } from './http.hook';
import {
  GET_USERS,
  GET_CHANNELS,
  GET_DIRECT_MESSAGES,
  GET_MESSAGES,
  GET_MESSAGES_FOR_DIRECT_MSG,
} from '../redux/types';
import { useSelector } from 'react-redux';

export function useResourse(type, param = null, body = null) {
  const token = useSelector((state) => state.token);
  const userData = useSelector((state) => state.userData);
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
            token,
            'POST',
            userData.channels
          )
        ),
      };

    case GET_DIRECT_MESSAGES:
      return {
        listDirectMessages: wrapPromise(
          reduxServer(
            `/api/direct-message/get-direct-messages`,
            token,
            'POST',
            { listDirectMessages: userData.directMessages }
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
