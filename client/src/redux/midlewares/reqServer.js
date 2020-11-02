import { reduxServer } from '../../hooks/second.copy.http.hook.js';
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

export function reqServer({ dispatch }) {
	return function(next) {
    return function(action) {

		  const getData = async ( method, token=null, param=null, body=null ) => {
		    try {
		      switch ( method ) {
		        //SetUser, ConversationHeader
		        case GET_USERS:
		          return await reduxServer(`/api/channel/get-users${param}`, token) 
		          break;

		        //Channels
		        case GET_CHANNELS:
		          return await reduxServer("/api/channel/get-chunnels", token, "POST", body);
		          break;

		        //Channels
		        case GET_MESSAGES:
		          return await reduxServer(`/api/chat/get-messages${param}`, token, "POST", body)
		          break;
		      }
		    } catch (e) { console.log(e.message, e.error) }
		  }

		  const postData = async (method, token=null, body=null, param=null) => {
		    try {
		      switch ( method ) {
		        //SignUpPage
		        case POST_REGISTER:
		          return await reduxServer('api/auth/register', token, 'POST', body)
		          break;

		        //SignInPage
		        case POST_LOGIN:
		          return await reduxServer('/api/auth/login', token, 'POST', body)
		          break;

		        //InputUpdateMessages
		        case POST_MESSAGE:
		          return await reduxServer(`/api/chat/post-message${param}`, token, "POST", body)
		          break;

		        //AddChannel
		        case POST_CHANNEL:
		          return await reduxServer(`/api/channel/post-channel${param}`, token, "POST", body)
		          break;

		        //AddPeopleToChannel
		        case POST_ADD_PEOPLES_TO_CHANNEL:
		          return await reduxServer(`/api/channel/post-add-members-to-channel${param}`, token, "POST", body)
		          break;
		      }
		    } catch (e) { console.log(e.message, e.error) }
		  }

		  //InputUpdateMessages
		  const putData = async ( putMessage, id, param=null, token=null ) => {
		    return await reduxServer(`/api/chat/put-message${id}`, 'PUT', { ...putMessage }, token)
		  }

		  //MessageActionsPopup
		  const removeData = async ( id, token=null ) => {
		    return await reduxServer(`/api/chat/delete-message${id}`, token, 'DELETE')
		  }
    }
  }
}