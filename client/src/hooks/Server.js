import {useHttp} from '../hooks/http.hook.js'
import {useAuthContext} from '../context/AuthContext.js'
import {useMessagesContext} from '../context/MessagesContext.js'

export const useServer = (props) => {
  const {userId, setUsersNames} = useAuthContext()
  const {messages, setMessages} = useMessagesContext()
  const {request} = useHttp()

  const getUsers = async (url) => {
    try {
      return await request(url) 
    } catch (e) {console.log(e.message, e.error)}    
  }

  const getChannels = async (url, channels) => {
    try {
      return await request(url, "POST", channels)
    } catch (e) {console.log(e.message, e.error)}
  }

  const getMessages = async (url) => {
    try {
      if (userId) {
        const serverMessages = await request(url)
        return setMessages(serverMessages.messages.reverse())
      }
    } catch (e) {console.log(e.message, e.error)}
  }

  const postMessage = async (url, message) => {
    try {
      const data = await request(url, "POST", {...message})
      console.log(data.channelMessages)

      if (data.channelMessages) setMessages(data.channelMessages.reverse())

    } catch (e) {console.log(e.message, ", -  post-запит в catch попала помилка", e.error)}
  }


  const postChannel = async (url, channel) => {
    try {
      const data = await request(url, "POST", {...channel})
      console.log(data.channel)

      return data.channel
    } catch (e) {console.log(e.message, ", -  post-запит в catch попала помилка", e.error)}
  }

  const postAddPeoplesToChannel = async (url, peoples) => {
    try {
      const resInvite = await request(url, "POST", peoples)
      return resInvite.dataMember
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

  return {
    getUsers, 
    getChannels, 
    getMessages, 
    postMessage, 
    postChannel, 
    postAddPeoplesToChannel, 
    putData, 
    removeData
  }
}