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
import { reduxServer } from '../../hooks/second.copy.http.hook.js';

function dispatcher(type, url, token, method="GET", body=null) {
  return async dispatch => {
		try {
			const response = await reduxServer(url, token, method, body)
			console.log("response ", response)
			dispatch({ 
				type, 
				payload: response 
			})
		} catch (e) { 
			dispatch({
				type,
				payload: "403"
			})
			console.log(e) 
		}
  }
}

export const getData = ( method, token=null, param=null, body=null ) => {
  try {
    switch ( method ) {
      //SetUser, ConversationHeader
      case GET_USERS:
        return dispatcher(GET_USERS, `/api/channel/get-users${param}`, token)

      //Channels
      case GET_CHANNELS:
        return dispatcher(GET_CHANNELS, "/api/channel/get-chunnels", token, "POST", body);
        break;

      //Channels
      case GET_MESSAGES:
        return dispatcher(GET_MESSAGES, `/api/chat/get-messages${param}`, token, "POST", body)
        break;
    }
  } catch (e) { console.log(e.message, e.error) }
}

export const postData = (method, token=null, body=null, param=null) => {
  try {
    switch ( method ) {
      //SignUpPage
      case POST_REGISTER:
        return dispatcher(POST_REGISTER, 'api/auth/register', token, 'POST', body)
        break;

      //SignInPage
      case POST_LOGIN:
        return dispatcher(POST_LOGIN, '/api/auth/login', token, 'POST', body)
        break;

      //InputUpdateMessages
      case POST_MESSAGE:
        return dispatcher(POST_MESSAGE, `/api/chat/post-message${param}`, token, "POST", body)
        break;

      //AddChannel
      case POST_CHANNEL:
        return dispatcher(POST_CHANNEL, `/api/channel/post-channel${param}`, token, "POST", body)
        break;

      //AddPeopleToChannel
      case POST_ADD_PEOPLES_TO_CHANNEL:
        return dispatcher(POST_ADD_PEOPLES_TO_CHANNEL, `/api/channel/post-add-members-to-channel${param}`, token, "POST", body)
        break;
    }
  } catch (e) { console.log(e.message, e.error) }
}

//InputUpdateMessages
export const putData = ( putMessage, id, param=null, token=null ) => {
  return dispatcher(`/api/chat/put-message${id}`, 'PUT', { ...putMessage }, token)
}

//MessageActionsPopup
export const removeData = ( id, token=null ) => {
  return dispatcher(`/api/chat/delete-message${id}`, token, 'DELETE')
}