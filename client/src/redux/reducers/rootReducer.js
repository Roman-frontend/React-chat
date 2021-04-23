import {
  GET_USERS,
  GET_USERS_ONLINE,
  GET_CHANNELS,
  POST_REGISTER,
  AUTH,
  POST_CHANNEL,
  POST_ADD_PEOPLES_TO_CHANNEL,
  POST_ADD_PEOPLE_TO_DIRECT_MESSAGES,
  PUT_MESSAGE,
  REMOVE_MESSAGE,
  REMOVE_DIRECT_MESSAGES,
  REMOVE_CHANNEL,
  LOGIN_DATA,
  LOGOUT_DATA,
  ACTIVE_CHAT_ID,
} from '../types.js';

const initialState = {
  users: null,
  usersOnline: [],
  channels: null,
  listDirectMessages: [],
  channelId: null,
  directMessageId: null,
  messages: [],
  token: null,
  userData: null,
  newMessage: null,
};

export const rootReducer = (state = initialState, action) => {
  //console.log(action.type, action.payload);
  switch (action.type) {
    case GET_USERS:
      return { ...state, users: action.payload.users };

    case GET_USERS_ONLINE:
      return { ...state, usersOnline: action.payload };

    case GET_CHANNELS:
      return { ...state, channels: action.payload.userChannels };

    case POST_REGISTER:
      return {
        ...state,
        token: action.payload.token,
        userData: action.payload.userData,
      };

    case AUTH:
      return { ...state, ...action.payload };

    case POST_CHANNEL:
      const updatedChannelsWithPost = state.channels.concat(
        action.payload.newChannel
      );
      const updatedUserChannels = state.userData.channels.concat(
        action.payload.newChannel._id
      );

      return {
        ...state,
        channels: updatedChannelsWithPost,
        userData: { ...state.userData, channels: updatedUserChannels },
      };

    case POST_ADD_PEOPLES_TO_CHANNEL:
      const updatedChannels = state.channels.map((channel) => {
        return channel._id !== action.payload.userChannels._id
          ? channel
          : action.payload.userChannels;
      });
      return { ...state, channels: updatedChannels };

    case POST_ADD_PEOPLE_TO_DIRECT_MESSAGES:
      const updatedList = state.listDirectMessages.concat(
        action.payload.allNewDirectMessage
      );
      const newDirectMessagesId = action.payload.allNewDirectMessage.map(
        (directMessage) => {
          return directMessage._id;
        }
      );
      return {
        ...state,
        listDirectMessages: updatedList,
        userData: {
          ...state.userData,
          directMessages: newDirectMessagesId,
        },
      };

    case PUT_MESSAGE:
      const updatedMsg = state.messages.map((message) => {
        if (message._id === action.payload.updatedMessage._id) {
          return action.payload.updatedMessage;
        }
        return message;
      });
      return { ...state, messages: updatedMsg.reverse() };

    case REMOVE_CHANNEL:
      const filteredChannels = state.channels.filter(
        (channel) => channel._id !== action.payload.removedChannelId
      );
      const filteredUserChannels = state.userData.channels.filter(
        (id) => id !== action.payload.removedChannelId
      );
      return {
        ...state,
        userData: { ...state.userData, channels: filteredUserChannels },
        channels: filteredChannels,
      };

    case REMOVE_DIRECT_MESSAGES:
      const updated = state.listDirectMessages.filter(
        (directMsg) => directMsg._id !== action.payload.removedId
      );
      const filteredUserDirectMessages = state.userData.directMessages.filter(
        (directMessageId) => {
          return directMessageId !== action.payload.removedId;
        }
      );
      return {
        ...state,
        listDirectMessages: updated,
        userData: {
          ...state.userData,
          directMessages: filteredUserDirectMessages,
        },
      };

    case REMOVE_MESSAGE:
      const updatedMessages = state.messages.reverse().filter((message) => {
        return message._id !== action.payload.removedId;
      });
      return { ...state, messages: updatedMessages };

    case LOGIN_DATA:
      return { ...state, ...action.payload };

    case LOGOUT_DATA:
      return initialState;

    case ACTIVE_CHAT_ID:
      //console.log(action.payload);
      return { ...state, ...action.payload };

    default:
      return state;
  }
};
