import { reduxServer } from './http.hook';
<<<<<<< HEAD
=======
import {
  GET_USERS,
  GET_CHANNELS,
  GET_DIRECT_MESSAGES,
  GET_MESSAGES,
  GET_MESSAGES_FOR_DIRECT_MSG,
} from '../redux/types';
>>>>>>> bd58be86d4452ab3b6fe2b628dc8f01b0733d449

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
<<<<<<< HEAD
  const fetchUsers = await reduxServer(`/api/channel/get-user`);
  return fetchUsers;
}

async function getChannels(token, channels) {
  const fetchChannels = await reduxServer(
=======
  const a = await reduxServer(`/api/channel/get-user`);
  console.log(a);
  return a;
}

async function getChannels(token, channels) {
  const a = await reduxServer(
>>>>>>> bd58be86d4452ab3b6fe2b628dc8f01b0733d449
    '/api/channel/get-chunnels',
    token,
    'POST',
    channels
  );
<<<<<<< HEAD

  return fetchChannels;
}

async function getDirectMessages(token, listDirectMessages) {
  const fetchDirectMsg = await reduxServer(
    `/api/direct-message/get-direct-messages`,
    token,
    'POST',
    { listDirectMessages }
  );

  return fetchDirectMsg;
=======
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
>>>>>>> bd58be86d4452ab3b6fe2b628dc8f01b0733d449
}
