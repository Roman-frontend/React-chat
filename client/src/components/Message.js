import React, {useState} from 'react'
import '../css/OpinShareCSS.css'
import iconPeople from '../images/icon-people.png'

export default function Message(messages, setMessages, inputRef) {

  function editDate(date) {
    if (date < 10) { return `0${date}`}
    else { return date}
  }

  const sli = messages.slice(0, messages.length);
  const newDate = new Date();
  const date = `${editDate(newDate.getHours())}:${editDate(newDate.getMinutes())}
    ${editDate(newDate.getDate())}.${editDate(newDate.getMonth())}.${newDate.getFullYear()}`; 
  sli.unshift({username: 'Yulia', text: inputRef.current.value, createdAt: date},)
  setMessages(sli);
  inputRef.current.value = null
}