import {
  GET_USERS,
  GET_CHANNELS,
  GET_MESSAGES,
  GET_MESSAGES_FOR_DIRECT_MSG,
  GET_DIRECT_MESSAGES,
  POST_REGISTER,
  POST_LOGIN,
  POST_MESSAGE,
  POST_MESSAGE_FOR_DIRECT_MSG,
  POST_CHANNEL,
  POST_ADD_PEOPLES_TO_CHANNEL,
  POST_ADD_PEOPLE_TO_DIRECT_MESSAGES,
  REMOVE_MESSAGE,
} from "../types.js";
import { reduxServer } from "../../hooks/http.hook.js";

function dispatcher(type, url, token, method = "GET", body = null) {
  return async (dispatch) => {
    try {
      const response = await reduxServer(url, token, method, body);
      console.log("response ", response);
      dispatch({
        type,
        payload: response,
      });
    } catch (e) {
      dispatch({
        type,
        payload: "403",
      });
      console.log(e);
    }
  };
}

export const postData = (method, token = null, body = null, param = null) => {
  switch (method) {
    case POST_REGISTER:
      return dispatcher(
        POST_REGISTER,
        "api/auth/register",
        token,
        "POST",
        body
      );

    case POST_LOGIN:
      return dispatcher(POST_LOGIN, "/api/auth/login", token, "POST", body);

    case POST_CHANNEL:
      return dispatcher(
        POST_CHANNEL,
        `/api/channel/post-channel${param}`,
        token,
        "POST",
        body
      );

    case POST_ADD_PEOPLES_TO_CHANNEL:
      return dispatcher(
        POST_ADD_PEOPLES_TO_CHANNEL,
        `/api/channel/post-add-members-to-channel${param}`,
        token,
        "POST",
        body
      );
  }
};

export const putMessage = (messageForEdit, id, param = null, token = null) => {
  return dispatcher(
    `/api/chat/put-message${id}`,
    "PUT",
    { ...messageForEdit },
    token
  );
};

export function getUsers(token, param) {
  return dispatcher(GET_USERS, `/api/channel/get-users${param}`, token);
}

export const getChannels = (token, body) => {
  return dispatcher(
    GET_CHANNELS,
    "/api/channel/get-chunnels",
    token,
    "POST",
    body
  );
};

export const getMessages = (token, param, body) => {
  return dispatcher(
    GET_MESSAGES,
    `/api/chat/get-messages${param}`,
    token,
    "POST",
    body
  );
};

export const getDirectMessages = (token, userId) => {
  return dispatcher(
    GET_DIRECT_MESSAGES,
    `/api/direct-message/get-direct-messages${userId}`,
    token
  );
};

export const getMessagesForDirectMsg = (token, param) => {
  return dispatcher(
    GET_MESSAGES,
    `/api/direct-message-chat/get-messages${param}`,
    token
  );
};

export const postMessage = (token, body, param) => {
  return dispatcher(
    POST_MESSAGE,
    `/api/chat/post-message${param}`,
    token,
    "POST",
    body
  );
};

export const postMessageToDirectMsg = (token, body, param) => {
  return dispatcher(
    POST_MESSAGE_FOR_DIRECT_MSG,
    `/api/direct-message-chat/post-message${param}`,
    token,
    "POST",
    body
  );
};

export const postDirectMessages = (token, body) => {
  return dispatcher(
    POST_ADD_PEOPLE_TO_DIRECT_MESSAGES,
    `/api/direct-message/post-direct-messages`,
    token,
    "POST",
    body
  );
};
