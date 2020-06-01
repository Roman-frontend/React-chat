import React, {useState, useRef, useEffect} from 'react'
import '../css/OpinShareCSS.css'
import iconPeople from '../images/icon-people.png'
import Message from './Message'

export default function Messages(props) {
  const inputRef = useRef(null);
  const [messages, setMessages] = useState([])

  function editDate(date) {
    if (date < 10) { return `0${date}`}
    else { return date}
  }


  function keyInput(event) {
    if (event.key === "Enter") {
      if (inputRef.current.value === "") {return}
      const sli = messages.slice(0, messages.length);
      const newDate = new Date();
      const date = `${editDate(newDate.getHours())}:${editDate(newDate.getMinutes())}
        ${editDate(newDate.getDate())}.${editDate(newDate.getMonth())}.${newDate.getFullYear()}`; 
      sli.unshift({username: 'Yulia', text: inputRef.current.value, createdAt: date},)
      setMessages(sli);
      inputRef.current.value = null
    }
  }

  useEffect(() => {
    inputRef.current.focus()
  })

  function renderMessages(messages) {
    return messages.map((msg) => {return <Message message={msg}/>})
  }

  return(
    <div className="right-block">
      <div className="nick-people">
        <b className="main-font sets-peoples-of-chat"> ✩ Yulia</b>
      </div>
      <div className="chat-with-people">
      {renderMessages(messages)}
      </div>
      <div className="fild-for-message">
        <input type="text" className="input-message"
          ref={inputRef} onKeyUp={event => keyInput(event)}/>
      </div>
    </div>
  )
}
