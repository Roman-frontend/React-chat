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

  function handleClick(sliceMessages) {
    if (inputRef.current.value === "") {return}
    const sli = sliceMessages.slice(0, sliceMessages.length);
    const newDate = new Date();
    const date = `${editDate(newDate.getHours())}:${editDate(newDate.getMinutes())}
      ${editDate(newDate.getDate())}.${editDate(newDate.getMonth())}.${newDate.getFullYear()}`; 
    sli.unshift({username: 'Yulia', text: inputRef.current.value, createdAt: date},)
    setMessages(sli);
    //onButtonClick();
  }

  //const onButtonClick = () => { inputRef.current.focus()};
  useEffect(() => {
    inputRef.current.focus()
  })

  function keyInput() {
    if (event === "Enter") {alert("hi")}
    return
  }

  return(
    <div>
      <div className="nick-people">
        <b className="main-font sets-peoples-of-chat"> ✩ Yulia</b>
      </div>
      <div className="chat-with-people">
        <Message
          messages={messages}/>
        <div className="fild-for-message">
          <input type="text" className="input-message"
            ref={inputRef}/>
          <button className="button" onClick={sliceMessages => handleClick(messages)} onKeyup={event => keyInput(event.key)}>hi
          </button>
        </div>
      </div>
    </div>
  )
}
