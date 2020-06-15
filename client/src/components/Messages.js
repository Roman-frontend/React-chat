import React, {useState, useRef, useEffect} from 'react'
import '../css/OpinShareCSS.css'
import iconPeople from '../images/icon-people.png'
import Message from './Message'
import {useHttp} from '../hooks/http.hook'

export default function Messages(props) {
  const inputRef = useRef(null);
  const [messages, setMessages] = useState([])
  const {loading, request, error} = useHttp()
  let mes = []

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
      sli.unshift({username: 'Yulia', text: inputRef.current.value, createdAt: date, id: Date.now()},)
      inputRef.current.value = null
    
      mes = sli
      requestHandler()
      getData()
    }
  }
  
  useEffect(() => {
    setTimeout(() => {
      inputRef.current.focus()
      if (mes[0] === undefined) {  
        getData()
      }
    }, 1000)
  }, [])

  const getData = async () => {
    try {
      const data = await request('/api/contacts')
      return setMessages(data)
    } catch (e) {console.log(e.message, ", ------ в catch попала помилка")}
  }

  const requestHandler = async () => {
    try {
      const data = await request('/api/contacts', "POST", {...mes[0]})
    } catch (e) {console.log(e.message, ", ------ в catch попала помилка")}
  }

  function renderMessages(messages) {
    return messages.map((msg, index) => { return <Message key={messages[index].id} message={msg} index={msg.id}/>})
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
        <input type="text" className="input-message" placeholder="Enter Text"
          ref={inputRef} onKeyUp={event => keyInput(event)}/>
      </div>
    </div>
  )
}
