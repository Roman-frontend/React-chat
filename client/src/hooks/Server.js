import {useContext} from 'react'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'

export const useServer = (props) => {
  const {userId, messages, setMessages, setUsersNames} = useContext(AuthContext)
  const {request} = useHttp()
  console.log('userId -', userId)

  const getData = async () => {
    try {
      const data = await request(`/api/chat/get-messages${userId}`)
      console.log(data.usersNames)
      setUsersNames(data.usersNames)
      if (data.messages) return setMessages(data.messages.reverse())
    } catch (e) {console.log(e.message, e.error)}
  }

  const postData = async (url, updatedArrayMessages) => {
    try {
      console.log("updatedArrayMessages -", updatedArrayMessages)
      const data = await request(url, "POST", {...updatedArrayMessages})
      setMessages(data.messages.reverse())
    } catch (e) {console.log(e.message, ", -  post-запит в catch попала помилка", e.error)}
  }

  const putData = async (putMessage, _id) => {
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