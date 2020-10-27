import {
  GET_USERS, 
  GET_CHANNELS, 
  GET_MESSAGES, 
  POST_REGISTER, 
  POST_LOGIN, 
  POST_MESSAGE, 
  POST_CHANNEL, 
  POST_ADD_PEOPLES_TO_CHANNEL
} from '../types.js'

const initialState = {
	users: [],
	fetched: []
}

export const reqReducer = (state=initialState, action) => {
	switch (action.type) {
		case GET_USERS:
			return { ...state, fetched: action.payload }
		default: return state
	}
}