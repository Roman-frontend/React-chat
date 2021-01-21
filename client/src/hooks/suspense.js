import { reduxServer } from './http.hook';
import {
  GET_USERS,
  GET_CHANNELS,
  GET_DIRECT_MESSAGES,
  GET_MESSAGES,
  GET_MESSAGES_FOR_DIRECT_MSG,
} from '../redux/types';

export const fetchData = (token, userData) => {
  const resUsers = getUsers();
  const resChannels = getChannels(token, userData.channels);
  const resDirectMessages = getDirectMessages(token, userData.directMessages);

  return {
    users: wrapPromise(resUsers),
    channels: wrapPromise(resChannels),
    listDirectMessages: wrapPromise(resDirectMessages),
  };
};

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

async function getUsers() {
  const a = await reduxServer(`/api/channel/get-user`);
  console.log(a);
  return a;
}

async function getChannels(token, channels) {
  const a = await reduxServer(
    '/api/channel/get-chunnels',
    token,
    'POST',
    channels
  );
  console.log(a);
  return a;
}

async function getDirectMessages(token, listDirectMessages) {
  const a = await reduxServer(
    `/api/direct-message/get-direct-messages`,
    token,
    'POST',
    {
      listDirectMessages,
    }
  );
  console.log(a);
  return a;
}
