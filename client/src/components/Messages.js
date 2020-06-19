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
    document.addEventListener('onClick', fieldAnswer, console.log('onClick'))
    inputRef.current.focus()
    getData(setMessages)
    return () => {
      document.removeEventListener('onClick', fieldAnswer)
      console.log('onClick')
    }
  }, [])

  function hideButton() {
    const sli = messages.slice(0, messages.length);
    const changeMas = sli.map(i => {
      if (i.editText) {
        i.editText = !i.editText
        return i
      } else return i
    })
    setMessages(changeMas)
    inputRef.current.value = ""
  }

  function fieldAnswer(id, index) {
    try {
      const sli = messages.slice(0, messages.length);
      let answerTo = []
      if (id) {
        answerTo = sli.map(i => {
          if (i.id === id) {
            i.answer = !i.answer
            i.more = false
            return i
          } else { 
            i.answer = false
            return i
          }
        })
        if (messages !== answerTo) setMessages(answerTo)
        answerTo = answerTo[index]
        if (showAnswer !== false ) {setShowAnswer(false)}
        putData(answerTo.id, setMessages, messages)
        console.log("id", id)
      } else {
        answerTo = messages.find(i => i.answer === true)
        if (answerTo) { return hideButton() }
        console.log("!sli[index].an", answerTo)
      }
      if (answerTo) { return hideButton() }
      console.log("end function")
      return ( 
        <div className="field-answer" style={{display: answerTo ? 'block' : 'none'}}>
          <p>{answerTo ? answerTo.text : false}</p>
        </div>)
    } catch(e) {console.log("Помилка", e)}
  }

  function renderMessages(messages) {
    return messages.map((msg, index) => {
      return ( <Message key={messages[index].id} message={msg} ind={index} 
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



