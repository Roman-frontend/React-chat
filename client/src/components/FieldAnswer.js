import React from 'react'
import '../css/OpinShareCSS.css'
import iconMore from '../images/icon-more.png'
import {useHttp} from '../hooks/http.hook'

export default function FieldAnswer(props) {
  const {loading, request, error} = useHttp()

  const {username, text, createdAt, id, more} = props.message
  const {messages, setMessages, message, inputRef, ind} = props

  function answer(id, index) {
    const sli = messages.slice(0, messages.length);
    const changeMas = sli.map(i => {
      if (i.id === id) {
        i.answer = !i.answer
        return i
      } else { 
        i.answer = false
        return i
      }
    })
    setMessages(changeMas)
    fieldAnswer(index)
  }

  function fieldAnswer(index) {
    let idMasAnswer = []
    if (!index + 1) {
      idMasAnswer = messages.find(i => i.answer === true)
    } else {
      idMasAnswer = messages[index];
      setShowAnswer(idMasAnswer);
      putChangedMessage(idMasAnswer[0].id)
    }  
    console.log("showAnswer", showAnswer[0])  
    return (
      <div className="field-answer" style={{display: idMasAnswer ? 'block' : 'none'}}>
        <p>idMasAnswer.text</p>
      </div>)
  }

  return fieldAnswer()

}