import {
  GET_USERS, 
  GET_CHANNELS, 
  GET_MESSAGES, 
  POST_REGISTER, 
  POST_LOGIN, 
  POST_MESSAGE, 
  POST_CHANNEL, 
  POST_ADD_PEOPLES_TO_CHANNEL,
  REMOVE_MESSAGE,
	LOGIN_DATA,
	LOGOUT_DATA,
  ACTIVE_CHANNEL_ID
} from '../types.js'

const initialState = {
	users: null,
	channels: null,
	activeChannelId: null,
	messages: [],
	token: null,
	userData: null,
}

export const rootReducer = (state=initialState, action) => {
	console.log(action.payload)
	switch (action.type) {
		case GET_USERS:
			return { ...state, users: action.payload.users }

		case GET_CHANNELS:
			return { ...state, 
				channels: action.payload.userChannels, 
				activeChannelId: action.payload.userChannels[0]._id 
			}

		case GET_MESSAGES:
			return { ...state, messages: action.payload.messages }

		case POST_REGISTER:
			return { ...state, token: action.payload.token, userData: action.payload.userData }

		case POST_LOGIN:
			return { ...state, token: action.payload.token, userData: action.payload.userData }

		case POST_MESSAGE:
			return { ...state, messages: action.payload.messages }

		case POST_CHANNEL:
			return { ...state, userData: action.payload.userData }

		case POST_ADD_PEOPLES_TO_CHANNEL:
			return { ...state, channels: action.payload.userChannels }

		case REMOVE_MESSAGE:
			return { ...state, messages: action.payload.messages }

		case LOGIN_DATA:
			return { ...state, token: action.payload.token, userData: action.payload.userData }
		
		case LOGOUT_DATA:
			return { ...state, token: action.payload, userData: action.payload }

		case ACTIVE_CHANNEL_ID:
			return { ...state, activeChannelId: action.payload }

		default: return state
	}
}