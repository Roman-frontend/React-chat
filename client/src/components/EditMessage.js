import React, {useContext} from 'react'
import {useServer} from '../hooks/Server'
import {useHttp} from '../hooks/http.hook'
import {Context} from '../context/context'
import iconMore from '../images/icon-more.png'

export default function EditMessage(props) {
  const {request} = useHttp()
  const {removeData} = useServer()
  const {id} = props.message
  const {message} = props
  const {messages, setMessages, setShowAnswer, inputRef, setShowButtonExit} = useContext(Context)

  function change(id) {
    if (!id) {
      return ( <button className="edit-mes" 
        onClick={(id) => change(id)}>
        Змінити</button> )
    }

    setMessages(changeMessages())
    setShowAnswer(false)
    debugger
  }

  function answer(id) {
    const answerTo = messages.map(message => {
      if (message.id === id) {
        message.answer = !message.answer
        message.changed = false
        setShowAnswer(message.answer)
        return message
      } else { 
        message.answer = false
        message.changed = false
        return message
      }
    })
    setMessages(answerTo)
    inputRef.current.value = ""
  }

  function changeMessages() {
    const changeMas = messages.map(message => {
      if (message.id === id) {
        message.changed = !message.changed;
        message.answer = false
        inputRef.current.value = message.text
        return message
      } else {
        message.answer = false
        return message
      }
    })
    return changeMas
  }

  function sets() {
    if (message.listAction) {
  	  return (
  	  	<div className="change-mes">

  	  	  <button className="answer-mes" 
          onClick={(id) => answer(message.id)}
          >
          Відповісти
          </button>

  	  	  {change()}

  	  	  <button className="redirect-mes">Поділитись</button>
  	  	  <button className="delete-mes" 
          onClick={id, setMessages, msg => removeData(id, setMessages, messages)}>Видалити</button>
  	  	</div>
  	  )
    } else return <img src={iconMore} alt="icon-user"/>
  }

  return sets()
}