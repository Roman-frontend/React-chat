import {useHttp} from '../hooks/http.hook.js'

export const useServer = (props) => {
  const {request} = useHttp()

  const getData = async (method, param=null, body=null) => {
    try {
      switch (method) {
        case "getUsers":
          return await request(`/api/channel/get-users${param}`) 
          break;

        case "getChannels":
          return await request("/api/channel/post-chunnels", "POST", body);
          break;

        case "getMessages":
          return await request(`/api/chat/get-messages${param}`, "GET", body)
          break;
      }
    } catch (e) { console.log(e.message, e.error) }
  }

  const postData = async (method, param=null, body=null) => {
    try {
      switch (method) {
        case "postMessage":
          return await request(`/api/chat/post-message${param}`, "POST", {...body})
          break;

        case "postChannel":
          return await request(`/api/channel/post-channel${param}` , "POST", body)
          break;

        case "postAddPeoplesToChannel":
          return await request(`/api/channel/post-add-members-to-channel${param}`, "POST", body)
          break;
      }
    } catch (e) { console.log(e.message, e.error) }
  }

  const putData = async (putMessage, id) => {
    return await request(`/api/chat/put-message${id}`, 'PUT', { ...putMessage })
  }

  const removeData = async (id) => {
    return await request(`/api/chat/delete-message${id}`, 'DELETE')
  }


  return { getData, postData, putData, removeData }
}