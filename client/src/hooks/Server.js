import {useContext} from 'react'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import {Context} from '../context/context'

export const useServer = (props) => {
  const {userId} = useContext(AuthContext)
  const {request} = useHttp()

  const getData = async () => {
    try {
      const data = await request(`/api/chat/get-messages${userId}`)
      return data.messages
    } catch (e) {console.log(e.message, e.error)}
  }

  const postData = async (_id, messages, setMessages) => {
    try {
      const data = await request(`/api/chat/post-message${_id}`, "POST", {...messages[0]})
      setMessages(data.messages.reverse())
      return data.messages
    } catch (e) {console.log(e.message, ", -  post-запит в catch попала помилка", e.error)}
  }

  const putData = async (putMessage, _id, setMessages, messages) => {
    const contact = messages.find(c => c._id === _id)
    const updated = await request(`/api/chat/put-message${_id}`, 'PUT', {
      ...putMessage,
    })
    
    setMessages(updated.messages.reverse())
  }

  const removeData = async (userId, setMessages, msg, _id, messagge) => {
    const message = await request(`/api/chat/delete-message${userId}/message${_id}`, 'DELETE', messagge)
    const filteredMessage = msg.filter(c => c._id !== _id)
    setMessages(filteredMessage)
  }

  return {getData, postData, putData, removeData}
}