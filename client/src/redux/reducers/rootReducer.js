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
  AUTH_DATA,
  ACTIVE_CHANNEL_ID
} from '../types.js'

const initialState = {
	users: null,
	channels: null,
	activeChannelId: 1,
	messages: [],
	registered: null,
	login: null,
	pushedMemberToChannel: null
}

export const rootReducer = (state=initialState, action) => {
	//console.log(action.type)
	switch (action.type) {
		case GET_USERS:
			return { ...state, users: action.payload.users }

		case GET_CHANNELS:
			return { ...state, channels: action.payload.userChannels }

		case GET_MESSAGES:
			return { ...state, messages: action.payload.messages }

		case POST_REGISTER:
			return { ...state, registered: action.payload }

		case POST_LOGIN:
			return { ...state, login: action.payload }

		case POST_MESSAGE:
			return { ...state, messages: action.payload.messages }

		case POST_CHANNEL:
			return { ...state, login: { ...state.login, userData: action.payload.userData } }

		case POST_ADD_PEOPLES_TO_CHANNEL:
			return { ...state, channels: action.payload.userChannels, pushedMemberToChannel: action.payload.dataMember }

		case REMOVE_MESSAGE:
			return { ...state, messages: action.payload.messages }

		case AUTH_DATA:
			return { ...state, login: action.payload }

		case ACTIVE_CHANNEL_ID:
			return { ...state, activeChannelId: action.payload }

		default: return state
	}
}