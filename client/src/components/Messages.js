import React, {useState, useRef, useEffect} from 'react'
import {useServer} from '../hooks/Server'
import {Context} from '../context/context'
import Message from './Message'
import InputMessage from './InputMessage'
import iconPeople from '../images/icon-people.png'


export default function Messages(props) {
  const inputRef = useRef(null);
  const [messages, setMessages] = useState([])
  const {getData} = useServer()
  const [showAnswer, setShowAnswer] = useState(false)
  let mes = []
  
  useEffect(() => {
    inputRef.current.focus()
    getData(setMessages)
  }, [])

  function hideButton(push=false) {
    let ifTrue = false
    const changeMas = messages.map(i => {
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
      return (<div className="field-answer" style={{display: 'block'}}>
          <p>{answerTo.text}</p>
        </div>)
    } else return <div className="field-answer" style={{display: 'none'}}></div>
  }

  function renderMessages(messages) {

    return messages.map((msg, index) => {
      return ( 
      <Message key={messages[index].id} 
        message={msg} 
        index={index} 
      />)
    })
  }

  function buttonTextEdit() {
    const idMasEd = messages.find((i) => i.editText === true)
      
    if (idMasEd) {
      return <button className="button-text-edit" onClick={push => hideButton(true)}>X</button>
    } else return true
  }


  return (
//З допомогою Context.provider з допомогою якого ми передаватимемо на дочерні елементи різні значення
//Передаєм йому значення value куди оприділяємо обєкт який міститиме в собі функції дозволяючий змінити головний стан
    <Context.Provider value={{messages, setMessages, showAnswer, setShowAnswer, inputRef}}>
      <div className="right-block"
      style={{gridTemplateRows: showAnswer ? "11vh 61vh 10vh" : "11vh 71vh"}}>
        <div className="nick-people">
          <b className="main-font sets-peoples-of-chat">
           ✩ Yulia
          </b>
        </div>
        {fieldAnswer()}
        <div className="chat-with-people">
        {renderMessages(messages)}
        </div>
        <div className="field-for-message">
          <InputMessage />
          {buttonTextEdit()}
        </div>
      </div>
    </Context.Provider>
  )
}



