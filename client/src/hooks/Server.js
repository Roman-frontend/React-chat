import {useHttp} from '../hooks/http.hook'

export const useServer = (props) => {

  const {request} = useHttp()

  const getData = async (id, setMessages) => {
    try {
      const data = await request(`/api/chat/get-messages${id}`)
      if (!data.messages) return setMessages([])
      setMessages(data.messages.reverse())
      return data.messages
    } catch (e) {console.log(e.message, ", -  get-запит в catch попала помилка")}
  }

  const postData = async (id, messages, setMessages) => {
    try {
      const data = await request(`/api/chat/post-message${id}`, "POST", {...messages[0]})
      setMessages(data.messages.reverse())

    } catch (e) {console.log(e.message, ", -  post-запит в catch попала помилка")}
  }

  const putData = async (putMessage, _id, setMessages, messages) => {
    const contact = messages.find(c => c._id === _id)
    const updated = await request(`/api/chat/put-message${_id}`, 'PUT', {
      ...putMessage,
    })
    
    setMessages(updated.messages.reverse())
  }

  const removeData = async (userId, setMessages, msg, _id, messagge) => {
    console.log('messageId - ', _id)
    const message = await request(`/api/chat/delete-message${userId}/message${_id}`, 'DELETE', messagge)
    const filteredMessage = msg.filter(c => c._id !== _id)
    setMessages(filteredMessage)
  }

  return {getData, postData, putData, removeData}
}