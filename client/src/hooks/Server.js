import {useContext} from 'react'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'

export const useServer = (props) => {
  const {userId, messages, setMessages} = useContext(AuthContext)
  const {request} = useHttp()

  const getData = async () => {
    try {
      const data = await request(`/api/chat/get-messages${userId}`)
      return data.messages
    } catch (e) {console.log(e.message, e.error)}
  }

  const postData = async (messages, setMessages) => {
    try {
      const data = await request(`/api/chat/post-message`, "POST", {...messages[0]})
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

  const removeData = async (message) => {
    await request(`/api/chat/delete-message${message._id}`, 'DELETE')
    const filteredMessage = messages.filter(c => c._id !== message._id)
    setMessages(filteredMessage)
  }

  return {getData, postData, putData, removeData}
}