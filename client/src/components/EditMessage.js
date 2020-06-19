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
    let trueEdit = false
    let changeMas = []
//Пошук по індексу
    if (id) {
      changeMas = sli.map(i => {
        if (i.id === id) {
          i.editText = !i.editText;
          i.more = false
          console.log("i.more ", i.more, "i.answer", i.answer)
          return i
        } else return i
      })
//Перевірка на наявність виклику змінити повідомлення при перереднерингу чи перезагрузці сторінки
    } else { 
      changeMas = sli.map(i => {
        if (i.editText) {
          trueEdit = true
          i.editText = !i.editText; 
          return i
        } else return i
      })
    }  
    setMessages(changeMas)
    inputRef.current.value = messages[index].text
  }

  function answer(id, index) {
    console.log("answer")
    const sli = messages.slice(0, messages.length);
    const answerTo = sli.map(i => {
      if (i.id === id) {
        i.index = index
        i.answer = !i.answer
        i.more = false
        return i
      } else { 
        i.answer = false
        return i
      }
    })
    setMessages(answerTo)
    setShowAnswer(true)
  }

  function sets() {
    if (more) {
  	  return (
  	  	<div className="change-mes">
  	  	  <button className="answer-mes" onClick={(id, index) => answer(message.id, ind)}>Відповісти</button>
  	  	  <button className="edit-mes" onClick={(id, index) => changeMessage(message.id, ind)}>Змінити</button>
  	  	  <button className="redirect-mes">Поділитись</button>
  	  	  <button className="delete-mes" onClick={id, setMessages, msg => removeData(message.id, setMessages, messages)}>Видалити</button>
  	  	</div>
  	  )
    } else return <img src={iconMore} alt="icon-user"/>
  }

  return sets()
}