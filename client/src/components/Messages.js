import React, {useState, useRef, useEffect} from 'react'
import {useServer} from '../hooks/Server'
import {Context} from '../context/context'
import Message from './Message'
import ButtonExitChangeMessage from './ButtonExitChangeMessage'
import InputUpdateMessages from './InputUpdateMessages'
import iconPeople from '../images/icon-people.png'


export default function Messages(props) {
  const inputRef = useRef(null);
  const [messages, setMessages] = useState([])
  const {getData} = useServer()
  const [showAnswer, setShowAnswer] = useState(false)
  const [showButtonExit, setShowButtonExit] = useState(false)
  let mes = []
  
  useEffect(() => {
    inputRef.current.focus()
    getData(setMessages)
  }, [])

  function fieldAnswerTo() {
    const answerTo = messages.find(message => message.answer !== false)
    if (answerTo) {
      if (showButtonExit) { setShowButtonExit(false) }
      return (<div className="field-answer" style={{display: 'block'}}>
        <p>{answerTo.text}</p>
      </div>)
    } else return <div className="field-answer" style={{display: 'none'}}></div>
  }

  function renderMessages(messages) {

    return messages.map((message, index) => {
      return ( 
      <Message key={messages[index].id} 
        message={message} 
      />)
    })
  }

  return (
    <Context.Provider value={{messages, setMessages, showAnswer, setShowAnswer, inputRef, showButtonExit, setShowButtonExit}}>
      <div className="right-block"
      style={{gridTemplateRows: showAnswer ? "11vh 61vh 10vh" : "11vh 71vh"}}>
        <div className="nick-people">
          <b className="main-font sets-peoples-of-chat">
           ✩ Yulia
          </b>
        </div>
        <div className="chat-with-people">
        {renderMessages(messages)}
        </div>
        {fieldAnswerTo()}
        <div className="field-for-message">
          <InputUpdateMessages />
          <ButtonExitChangeMessage />
        </div>
      </div>
    </Context.Provider>
  )
}



