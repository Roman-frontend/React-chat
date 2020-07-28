import React, {useState, useRef, useEffect, useContext} from 'react'
import {useServer} from '../hooks/Server'
import {AuthContext} from '../context/AuthContext'
import {Context} from '../context/context'
import Message from './Message'
import ButtonExitChangeMessage from './ButtonExitChangeMessage'
import InputUpdateMessages from './InputUpdateMessages'
import iconPeople from '../images/icon-people.png'


export default function Messages(props) {
  const {name, userId} = useContext(AuthContext)
  const [messages, setMessages] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showButtonExit, setShowButtonExit] = useState(false);
  const inputRef = useRef(null);
  const {getData} = useServer();

  const getMessagesFromServer = async () => {
    const b = await getData()
    if (b) return setMessages(b.reverse())
    return setMessages([]);
  }
  
  useEffect(() => {
    inputRef.current.focus();
    getMessagesFromServer()
    //document.addEventListener('click', handleClick)
  }, []);
  
  /**
  *Показує поле з повідомленням на яке відповідає користувач
  *якщо в масиві повідомлень messages є повідомлення для відповіді 
  */
  function fieldAnswerTo() {
    const answerTo = messages.find(message => message.answer === true);
    if (answerTo) {
      /**@return поле повідомлення на яке відповідає користувач*/
      return (<div className="field-answer" style={{display: 'block'}}>
        <p>{answerTo.text}</p>
      </div>);
    }
  }

  /**
  *Створює список повідомлень з масиву messages
  *@param {messages} масив обєктів зі значеннями для створення списку повідомлень 
  */
  function renderMessages() {
    return messages.map((message, index) => {
      /**@return повідомлення користувача */
      return ( 
      <Message key={messages[index]._id} 
        message={message} 
      />);
    })
  }

  return (
    <Context.Provider value={{
      messages, 
      setMessages, 
      showAnswer, 
      setShowAnswer, 
      inputRef, 
      showButtonExit, 
      setShowButtonExit
    }}>
      <div className="right-block"
      style={{gridTemplateRows: showAnswer ? "11vh 61vh 10vh" : "11vh 71vh"}}>
        <div className="nick-people">
          <b className="main-font sets-peoples-of-chat">
           ✩ {name}
          </b>
        </div>
        <div className="chat-with-people">
        {renderMessages()}
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



