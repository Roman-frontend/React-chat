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
  AUTH_DATA
} from '../types.js'

const initialState = {
	users: null,
	channels: null,
	messages: [],
	registered: null,
	login: null,
	newChannel: null,
	pushedMemberToChannel: null
}

export const rootReducer = (state=initialState, action) => {
	console.log(action.type)
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
			return { ...state, newChannel: action.payload.userChannels, login: { ...state.login, userData: action.payload.userData } }

		case POST_ADD_PEOPLES_TO_CHANNEL:
			return { ...state, pushedMemberToChannel: action.payload.dataMember }

		case REMOVE_MESSAGE:
			return { ...state, messages: action.payload.messages }

		case AUTH_DATA:
			return { ...state, login: action.payload }

		default: return state
	}
}