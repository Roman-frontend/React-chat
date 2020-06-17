import React from 'react'
import '../css/OpinShareCSS.css'
import iconMore from '../images/icon-more.png'
import {useHttp} from '../hooks/http.hook'

export default function EditMessage(props) {
  const {loading, request, error} = useHttp()

  const {username, text, createdAt, id, more} = props.message
  const {messages, setMessages, message, inputRef, ind} = props

  function changeMessage(id, index) {
    const sli = messages.slice(0, messages.length);
    console.log("sli ", sli, "index - ", index)
    let changeMas = []
    if (sli[index].editText) {
      changeMas = sli.map(i => {if (i.id === id) { i.editText = !i.editText; return i} ; return i})
    } else changeMas = sli.map(i => {
      if (i.id === id) {
        i.editText = !i.editText; 
        return i
      } else if (i.editText) {
        i.editText = !i.editText
        return i
      } else return i
    })
    setMessages(changeMas)
    inputRef.current.value = messages[index].text
  }

  const removeContact = async (id) => {
    const message = await request(`/api/contacts/${id}`, 'DELETE')
    const filteredMessage = messages.filter(c => c.id !== id)
    setMessages(filteredMessage)
  }

  function sets() {
    if (more) {
  	  return (
  	  	<div className="change-mes">
  	  	  <button className="answer-mes" onClick={(id, index) => props.answer(message.id, ind)}>Відповісти</button>
  	  	  <button className="edit-mes" onClick={(id, index) => changeMessage(message.id, ind)}>Змінити</button>
  	  	  <button className="redirect-mes">Поділитись</button>
  	  	  <button className="delete-mes" onClick={id => removeContact(message.id)}>Видалити</button>
  	  	</div>
  	  )
    } else return <img src={iconMore} alt="icon-user"/>
  }

  return sets()
}