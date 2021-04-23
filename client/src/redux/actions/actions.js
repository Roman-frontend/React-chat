import {
  GET_CHANNELS,
  POST_CHANNEL,
  POST_ADD_PEOPLES_TO_CHANNEL,
  POST_ADD_PEOPLE_TO_DIRECT_MESSAGES,
  REMOVE_MESSAGE,
  REMOVE_DIRECT_MESSAGES,
  REMOVE_CHANNEL,
} from '../types.js';
import { reduxServer } from '../../hooks/http.hook.js';

export function dispatcher(type, url, token, method = 'GET', body = null) {
  return async (dispatch) => {
    try {
      const response = await reduxServer(url, token, method, body);
      //console.log('response ', response);
      dispatch({ type, payload: response });
    } catch (e) {
      dispatch({ type, payload: '403' });
      console.log(e);
    }
  };
}

export const getChannels = (token, body) => {
  return dispatcher(
    GET_CHANNELS,
    '/api/channel/get-chunnels',
    token,
    'POST',
    body
  );
};

export const postDirectMessages = (token, body) => {
  return dispatcher(
    POST_ADD_PEOPLE_TO_DIRECT_MESSAGES,
    `/api/direct-message/post-direct-messages`,
    token,
    'POST',
    body
  );
};

export const postChannel = (token, body, param) => {
  return dispatcher(
    POST_CHANNEL,
    `/api/channel/post-channel${param}`,
    token,
    'POST',
    body
  );
};

export const removeChannel = (token, id, body) => {
  return dispatcher(
    REMOVE_CHANNEL,
    `/api/channel/delete-channel${id}`,
    token,
    'DELETE',
    body
  );
};

export const removeDirectMessages = (token, id, body) => {
  return dispatcher(
    REMOVE_DIRECT_MESSAGES,
    `/api/direct-message/delete-direct-messages${id}`,
    token,
    'DELETE',
    body
  );
};

export const removeChannelMessage = (token, param) => {
  return dispatcher(
    REMOVE_MESSAGE,
    `/api/chat/delete-message${param}`,
    token,
    'DELETE'
  );
};

export const removeMessageOfDirectMessage = (token, param) => {
  return dispatcher(
    REMOVE_MESSAGE,
    `/api/direct-message-chat/delete-message${param}`,
    token,
    'DELETE'
  );
};

export const addPeopleToChannel = (token, body, param) => {
  return dispatcher(
    POST_ADD_PEOPLES_TO_CHANNEL,
    `/api/channel/post-add-members-to-channel${param}`,
    token,
    'POST',
    body
  );
};
