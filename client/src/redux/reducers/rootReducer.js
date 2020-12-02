import {
  GET_USERS,
  GET_CHANNELS,
  GET_MESSAGES,
  GET_DIRECT_MESSAGES,
  POST_REGISTER,
  POST_LOGIN,
  POST_MESSAGE,
  POST_MESSAGE_FOR_DIRECT_MSG,
  POST_CHANNEL,
  POST_ADD_PEOPLES_TO_CHANNEL,
  POST_ADD_PEOPLE_TO_DIRECT_MESSAGES,
  REMOVE_MESSAGE,
  LOGIN_DATA,
  LOGOUT_DATA,
  ACTIVE_CHAT_ID,
  UPDATE_MESSAGES,
  PROCESSED_NEW_MESSAGE,
} from "../types.js";

const initialState = {
  users: null,
  channels: null,
  listDirectMessages: null,
  activeChannelId: null,
  activeDirectMessageId: null,
  messages: [],
  messagesOfDirectMessages: [],
  token: null,
  userData: null,
  newMessage: null,
};

export const rootReducer = (state = initialState, action) => {
  //console.log(action.payload);
  switch (action.type) {
    case GET_USERS:
      return { ...state, users: action.payload.users };

    case GET_CHANNELS:
      const storageData = JSON.parse(localStorage.getItem("userData"));
      const startedChannel = state.activeChannelId
        ? { activeChannelId: state.activeChannelId }
        : storageData.lastActiveChatId &&
          storageData.channels.includes(storageData.lastActiveChatId)
        ? { activeChannelId: storageData.lastActiveChatId }
        : storageData.lastActiveChatId &&
          !storageData.channels.includes(storageData.lastActiveChatId)
        ? { activeDirectMessageId: storageData.lastActiveChatId }
        : action.payload.userChannels
        ? { activeChannelId: action.payload.userChannels[0]._id }
        : null;

      return {
        ...state,
        channels: action.payload.userChannels,
        ...startedChannel,
      };

    case GET_MESSAGES:
      return { ...state, messages: action.payload.messages };

    case GET_DIRECT_MESSAGES:
      return { ...state, listDirectMessages: action.payload.directMessages };

    case POST_REGISTER:
      return {
        ...state,
        token: action.payload.token,
        userData: action.payload.userData,
      };

    case POST_LOGIN:
      return {
        ...state,
        token: action.payload.token,
        userData: action.payload.userData,
      };

    case POST_MESSAGE:
      return { ...state, newMessage: action.payload.newMessage };

    case POST_MESSAGE_FOR_DIRECT_MSG:
      return { ...state, newMessage: action.payload.newMessage };

    case POST_CHANNEL:
      return { ...state, userData: action.payload.userData };

    case POST_ADD_PEOPLES_TO_CHANNEL:
      return { ...state, channels: action.payload.userChannels };

    case POST_ADD_PEOPLE_TO_DIRECT_MESSAGES:
      return {
        ...state,
        listDirectMessages: action.payload.allDirectMessage,
        //listDirectMessages: state.listDirectMessages.concat(action.payload.message),
      };

    case REMOVE_MESSAGE:
      return {
        ...state,
        messages: action.payload,
      };

    case LOGIN_DATA:
      return {
        ...state,
        token: action.payload.token,
        userData: action.payload,
      };

    case LOGOUT_DATA:
      return { ...state, token: action.payload, userData: action.payload };

    case ACTIVE_CHAT_ID:
      return { ...state, ...action.payload };

    case UPDATE_MESSAGES:
      return { ...state, messages: action.payload };

    case PROCESSED_NEW_MESSAGE:
      return { ...state, newMessage: action.payload };

    default:
      return state;
  }
};
