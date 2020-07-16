import {useHttp} from '../hooks/http.hook'

export const useServer = (props) => {

  const {request} = useHttp()

  const getData = async (setMessages) => {
    try {
      const data = await request('/api/chat/get-messages')
      if (!data.messages) return setMessages([])
      setMessages(data.messages.reverse())
      return data.messages
    } catch (e) {console.log(e.message, ", -  get-запит в catch попала помилка")}
  }

  const postData = async (messages, setMessages) => {
    try {
      const data = await request('/api/chat/post-message', "POST", {...messages[0]})
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

  const removeData = async (_id, setMessages, msg) => {
    const message = await request(`/api/chat/delete-message${_id}`, 'DELETE')
    const filteredMessage = msg.filter(c => c._id !== _id)
    setMessages(filteredMessage)
  }

  return {getData, postData, putData, removeData}
}