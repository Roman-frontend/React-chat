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

export function getUsers(param, method, body, token) {
	const headers = {}
	headers['authorization'] = token
	console.log("action getUsers", param, method, body, headers)

  return async dispatch => {
		try {
			const response = await fetch(`/api/channel/get-users${param}`, { method, body, headers })
			const json = await response.json()
			//Закидаємо json - який є (постами) (як я розумію відповіддю сервера) в наш reducer викликаючи dispatch з (необхідним) типом FETCH_POSTS, і куди як payload передаємо json
			dispatch({ type: GET_USERS, payload: json })

		} catch (e) { console.log(e) }
  }
}

/*const getData = async ( method, token=null, param=null, body=null ) => {
  try {
    switch ( method ) {
      //SetUser, ConversationHeader
      case GET_USERS:
        return await request(`/api/channel/get-users${param}`, token) 
        break;

      //Channels
      case GET_CHANNELS:
        return await request("/api/channel/get-chunnels", token, "POST", body);
        break;

      //Channels
      case GET_MESSAGES:
        return await request(`/api/chat/get-messages${param}`, token, "POST", body)
        break;
    }
  } catch (e) { console.log(e.message, e.error) }
}

const postData = async (method, token=null, body=null, param=null) => {
  try {
    switch ( method ) {
      //SignUpPage
      case POST_REGISTER:
        return await request('api/auth/register', token, 'POST', body)
        break;

      //SignInPage
      case POST_LOGIN:
        return await request('/api/auth/login', token, 'POST', body)
        break;

      //InputUpdateMessages
      case POST_MESSAGE:
        return await request(`/api/chat/post-message${param}`, token, "POST", body)
        break;

      //AddChannel
      case POST_CHANNEL:
        return await request(`/api/channel/post-channel${param}`, token, "POST", body)
        break;

      //AddPeopleToChannel
      case POST_ADD_PEOPLES_TO_CHANNEL:
        return await request(`/api/channel/post-add-members-to-channel${param}`, token, "POST", body)
        break;
    }
  } catch (e) { console.log(e.message, e.error) }
}

//InputUpdateMessages
const putData = async ( putMessage, id, param=null, token=null ) => {
  return await request(`/api/chat/put-message${id}`, 'PUT', { ...putMessage }, token)
}

//MessageActionsPopup
const removeData = async ( id, token=null ) => {
  return await request(`/api/chat/delete-message${id}`, token, 'DELETE')
}*/