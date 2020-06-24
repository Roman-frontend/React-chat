import {useHttp} from '../hooks/http.hook'

export const useServer = (props) => {

  const {request} = useHttp()

  const getData = async (setMessages) => {
    try {
      const data = await request('/api/contacts')
      setMessages(data)
      return data
    } catch (e) {console.log(e.message, ", ------ в catch попала помилка")}
  }

  const postData = async (messages) => {
    try {
      const data = await request('/api/contacts', "POST", {...messages[0]})
    } catch (e) {console.log(e.message, ", ------ в catch попала помилка")}
  }

  const putData = async (id, setMessages, messages) => {
    const contact = messages.find(c => c.id === id)
    const updated = await request(`/api/contacts/${id}`, 'PUT', {
      ...contact,
    })
    setMessages(messages)
  }

  const removeData = async (id, setMessages, msg) => {
    const message = await request(`/api/contacts/${id}`, 'DELETE')
    const filteredMessage = msg.filter(c => c.id !== id)
    setMessages(filteredMessage)
  }

  return {getData, postData, putData, removeData}
}