import {FETCH_POST} from '../types.js'

const initialState = {}

export const reqReducer = (state=initialState, action) => {
	switch (action.type) {
		case FETCH_POST:
			return { ...state }
		default: return state
	}
}