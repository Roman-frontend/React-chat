import React, {useState, useRef, useEffect} from 'react'
import '../css/OpinShareCSS.css'
import iconPeople from '../images/icon-people.png'
import Message from './Message'
import HideButtonTextEdit from './HideButtonTextEdit'
import InputMessage from './InputMessage'
import {useServer} from './Server'

export default function Messages(props) {
  const inputRef = useRef(null);
  const [messages, setMessages] = useState([])
  const {getData, putData} = useServer()
  const [showAnswer, setShowAnswer] = useState(false)
  let mes = []
  
  useEffect(() => {
    inputRef.current.focus()
    getData(setMessages)
  }, [])

  function hideButton(push=false) {
    const sli = messages.slice(0, messages.length);
    let ifTrue = false
    const changeMas = sli.map(i => {
      if (i.editText) {
        if (push) {i.editText = !i.editText; inputRef.current.value = ""}
        ifTrue = true
        return i
      } else return i
    })
    if (ifTrue) setMessages(changeMas)
  }

  function fieldAnswer() {
    const answerTo = messages.find(i => i.index !== false)
    if (answerTo) {
      hideButton()
      return (<div className="field-answer" style={{display: answerTo.index + 1 ? 'block' : 'none'}}>
          <p>{answerTo.text}</p>
        </div>)
    } else {
      return <div className="field-answer" style={{display: 'none'}}></div>
    }
  }

  function renderMessages(messages) {
    return messages.map((msg, index) => {
      return ( <Message key={messages[index].id} message={msg} ind={index} setShowAnswer={setShowAnswer}
        setMessages={setMessages} messages={messages} inputRef={inputRef} fieldAnswer={fieldAnswer} />)
    })
  }
  return (
    <div className="right-block" style={{gridTemplateRows: !showAnswer ? "11vh 71vh" : "11vh 61vh 10vh"}}>
      <div className="nick-people">
        <b className="main-font sets-peoples-of-chat"> ✩ Yulia</b>
      </div>
      {fieldAnswer()}
      <div className="chat-with-people">
      {renderMessages(messages)}
      </div>
      <div className="field-for-message">
        <InputMessage inputRef={inputRef} setMessages={setMessages}
          messages={messages} mes={mes} setShowAnswer={setShowAnswer} showAnswer={showAnswer}/>
        <HideButtonTextEdit messages={messages}
          setMessages={setMessages} inputRef={inputRef} hideButton={hideButton}/>
      </div>
    </div>
  )
}



