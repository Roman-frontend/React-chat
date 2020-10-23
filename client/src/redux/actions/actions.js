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

export function getUsers() {
  return async dispatch => {
		try {
			const response = await fetch('ttps://jsonplaceholder.typicode.com/posts?_limit=5')
			//Закидаємо json - який є (постами) (як я розумію відповіддю сервера) в наш reducer викликаючи dispatch з (необхідним) типом FETCH_POSTS, і куди як payload передаємо json
			dispatch({ type: GET_USERS, payload: response })

		} catch (e) { console.log(e) }
  }
}