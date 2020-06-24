import React, {useContext} from 'react'
import {useServer} from '../hooks/Server'
import {useHttp} from '../hooks/http.hook'
import {Context} from '../context/context'
import iconMore from '../images/icon-more.png'

export default function EditMessage(props) {
  const {request} = useHttp()
  const {removeData} = useServer()
  const {id, more} = props.message
  const {message, ind} = props
  const {messages, setMessages, setShowAnswer, inputRef} = useContext(Context)

  function change(id, index) {
    if (!id) return button()
    const resultChange = changeMessages()
    setShowAnswer(false)
    setMessages(resultChange)
    if (!resultChange[index].editText) inputRef.current.value = ""
    return button()
  }

  function answer(id, index) {
    const answerTo = messages.map(i => {
      if (i.id === id) {
        i.answer = !i.answer
        setShowAnswer(i.answer)
        i.editText = false
        i.more = false
        if (i.answer) {
          i.index = index
        } else {
          i.index = false
        }
        return i
      } else { 
        i.answer = false
        i.editText = false
        return i
      }
    })
    setMessages(answerTo)
    inputRef.current.value = ""
  }

  function button() {
    return (
      <button className="edit-mes" 
      onClick={(id, index) => change(message.id, ind)}
      >Змінити</button>
    )
  }

  function changeMessages() {
    const changeMas = messages.map(i => {
      if (i.id === id) {
        i.editText = !i.editText;
        i.more = false
        i.answer = false
        i.index = false
        inputRef.current.value = i.text
        return i
      } else {
        i.answer = false
        i.index = false
        return i
      }
    })
    setMessages(changeMas)
    return changeMas
  }

  function sets() {
    if (more) {
  	  return (
  	  	<div className="change-mes">

  	  	  <button className="answer-mes" 
          onClick={(id, index) => answer(message.id, ind)}
          >
          Відповісти
          </button>

  	  	  {change()}

  	  	  <button className="redirect-mes">Поділитись</button>
  	  	  <button className="delete-mes" 
          onClick={id, setMessages, msg => removeData(message.id, setMessages, messages)}>Видалити</button>
  	  	</div>
  	  )
    } else return <img src={iconMore} alt="icon-user"/>
  }

  return sets()
}