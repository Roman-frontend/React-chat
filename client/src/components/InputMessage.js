import React from 'react'
import {useServer} from './Server'
import '../css/OpinShareCSS.css'

export default function Message(props) {
  const {messages, setMessages, inputRef, setShowAnswer, showAnswer} = props
  const {getData, postData, putData} = useServer()
  let mes = []

  function keyInput(event) {
    function editDate(date) {
      if (date < 10) { return `0${date}`}
      else { return date}
    }
    if (event.key === "Enter") {
      if (inputRef.current.value === "") {return}

      const sli = messages.slice(0, messages.length);
      const idMasEd = messages.find(i => i.editText === true)
      const indexMasEd = messages.indexOf(idMasEd, 0)
      let editedMessages = []

      if (indexMasEd + 1) {
        editedMessages = sli.map(i => {
          if (i === idMasEd) {
            i.text = inputRef.current.value
            i.editText = false
            return i
          } else return i
        })
        mes = editedMessages
        setMessages(editedMessages)
        putData(idMasEd.id, setMessages, messages)
      } else {
        const newDate = new Date();         
        const date = 
        `${editDate(newDate.getHours())}:
        ${editDate(newDate.getMinutes())}
        ${editDate(newDate.getDate())}.
        ${editDate(newDate.getMonth())}.
        ${newDate.getFullYear()}`; 

        sli.unshift({username: 'Yulia', text: inputRef.current.value, 
        createdAt: date, id: Date.now(), more: false, editText: false, answer: showAnswer, index: false},)        
        mes = sli
        setMessages(sli)
        postData(mes)
      }
      setShowAnswer(false)
      inputRef.current.value = null
    }
  }

  return <input type="text" className="input-message" placeholder="Enter Text" ref={inputRef} onKeyUp={event => keyInput(event)}/>
}