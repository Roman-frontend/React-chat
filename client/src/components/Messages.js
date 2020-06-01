import React, {useState, useRef, useEffect} from 'react'
import '../css/OpinShareCSS.css'
import iconPeople from '../images/icon-people.png'
import Message from './Message'

export default function Messages(props) {
  const inputRef = useRef(null);
  const [messages, setMessages] = useState([])
  const mes = messages.map((i, index) => 
    <div className="container">
      <div className="icon"><img src={iconPeople}/></div>
      <div className="messager"><p>{messages[index].username}</p></div>
      <div className="date"><p>{messages[index].createdAt}</p></div>
      <div className="message"><p>{messages[index].text}</p></div>
    </div>
  )

  function keyInput(event) {
    if (event.key === "Enter") {
      if (inputRef.current.value === "") {return}
      Message(messages, setMessages, inputRef)
    }
  }

  useEffect(() => {
    inputRef.current.focus()
  })

  return(
    <div className="right-block">
      <div className="nick-people">
        <b className="main-font sets-peoples-of-chat"> ✩ Yulia</b>
      </div>
      <div className="chat-with-people">{mes}</div>
      <div className="fild-for-message">
        <input type="text" className="input-message"
          ref={inputRef} onKeyUp={event => keyInput(event)}/>
      </div>
    </div>
  )
}
