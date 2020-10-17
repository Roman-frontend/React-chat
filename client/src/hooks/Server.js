import { useHttp } from '../hooks/http.hook.js'

export const useServer = (props) => {
  const { request } = useHttp()

  const getData = async ( method, token=null, param=null, body=null ) => {
    try {
      switch ( method ) {
        //SetUser, ConversationHeader
        case "getUsers":
          return await request(`/api/channel/get-users${param}`, token) 
          break;

        //Channels
        case "getChannels":
          return await request("/api/channel/get-chunnels", token, "POST", body);
          break;

        //Channels
        case "getMessages":
          return await request(`/api/chat/get-messages${param}`, token, "POST", body)
          break;
      }
    } catch (e) { console.log(e.message, e.error) }
  }

  const postData = async (method, token=null, body=null, param=null) => {
    try {
      switch ( method ) {
        //SignUpPage
        case "postRegister":
          return await request('api/auth/register', token, 'POST', body)
          break;

        //SignInPage
        case "postLogin":
          return await request('/api/auth/login', token, 'POST', body)
          break;

        //InputUpdateMessages
        case "postMessage":
          return await request(`/api/chat/post-message${param}`, token, "POST", body)
          break;

        //AddChannel
        case "postChannel":
          return await request(`/api/channel/post-channel${param}`, token, "POST", body)
          break;

        //AddPeopleToChannel
        case "postAddPeoplesToChannel":
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
  }


  return { getData, postData, putData, removeData }
}