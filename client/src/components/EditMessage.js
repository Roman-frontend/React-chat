import React from 'react'
import '../css/OpinShareCSS.css'
import {useServer} from './Server'
import {useHttp} from '../hooks/http.hook'
import iconMore from '../images/icon-more.png'

export default function EditMessage(props) {
  const {loading, request, error} = useHttp()
  const {removeData} = useServer()
  const {username, text, createdAt, id, more} = props.message
  const {messages, setMessages, message, inputRef, ind, setShowAnswer} = props

  function changeMessage(id, index) {
    const sli = messages.slice(0, messages.length);
    const fintEditioner = sli.find(i => i.editText === true)
    let trueEdit = false
    let changeMas = []
//Пошук по індексу
    if (id) {
      changeMas = sli.map(i => {
        if (i.id === id) {
          i.editText = !i.editText;
          i.more = false
          i.answer = false
          i.index = false
          return i
        } else {
          i.answer = false
          i.index = false
          return i
        }
      })
      setShowAnswer(false)
      setMessages(changeMas)
      inputRef.current.value = messages[index].text
      return <button className="edit-mes" onClick={(id, index) => changeMessage(message.id, ind)}>Змінити</button>
    } else if (fintEditioner) { 
      changeMas = sli.map(i => {
        if (i.editText) {
          trueEdit = true
          inputRef.current.value = i.text 
          return i
        } else return i
      })
      return <button className="edit-mes" onClick={(id, index) => changeMessage(message.id, ind)}>Змінити</button>
    } else { 
      inputRef.current.value = ""
      return <button className="edit-mes" onClick={(id, index) => changeMessage(message.id, ind)}>Змінити</button>
    }
  }

  function answer(id, index) {
    const sli = messages.slice(0, messages.length);
    const answerTo = sli.map(i => {
      if (i.id === id) {
        i.answer = !i.answer
        if (i.answer) {
          i.index = index
          i.more = false
          setShowAnswer(true)
        } else {
          i.index = false
          setShowAnswer(false)
        }
        i.editText = false
        i.more = false
        return i
      } else { 
        i.answer = false
        i.editText = false
        return i
      }
    })
    setMessages(answerTo)
    console.log(messages)
  }

  function sets() {
    if (more) {
  	  return (
  	  	<div className="change-mes">
  	  	  <button className="answer-mes" onClick={(id, index) => answer(message.id, ind)}>Відповісти</button>
  	  	  {changeMessage()}
  	  	  <button className="redirect-mes">Поділитись</button>
  	  	  <button className="delete-mes" onClick={id, setMessages, msg => removeData(message.id, setMessages, messages)}>Видалити</button>
  	  	</div>
  	  )
    } else return <img src={iconMore} alt="icon-user"/>
  }

  return sets()
}