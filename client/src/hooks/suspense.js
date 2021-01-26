import { reduxServer } from './http.hook';
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
  const fetchUsers = await reduxServer(`/api/channel/get-user`);
  return fetchUsers;
}

async function getChannels(token, channels) {
  const fetchChannels = await reduxServer(
    '/api/channel/get-chunnels',
    token,
    'POST',
    channels
  );
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
}
