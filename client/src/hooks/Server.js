import {useContext} from 'react'
import {useHttp} from '../hooks/http.hook.js'
import {useAuthContext} from '../context/AuthContext.js'
import {useMessagesContext} from '../context/MessagesContext.js'

export const useServer = (props) => {
  const {userId, setUsersNames} = useAuthContext()
  const {messages, setMessages} = useMessagesContext()
  const {request} = useHttp()

  const getData = async (url) => {
    try {
      if (userId) {
        const data = await request(url)
        setUsersNames(data.usersNames)
        if (data.messages) return setMessages(data.messages.reverse())
        console.log(data.userChannels)
        if (data.userChannels) {
          console.log('messages ', data.userMessages, 'channels ', data.userChannels)
          setMessages(data.userMessages.reverse())
          return data.userChannels
        }
      }
    } catch (e) {console.log(e.message, e.error)}
  }

  const postData = async (url, updatedArrayMessages) => {
    try {
      const data = await request(url, "POST", {...updatedArrayMessages})

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