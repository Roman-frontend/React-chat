import React, {useState, useRef, useEffect, useContext} from 'react'
import {AuthContext} from '../context/AuthContext'
import {MessagesContext} from '../context/MessagesContext.js'
import Message from './Message'
import ButtonExitChangeMessage from './ButtonExitChangeMessage'
import InputUpdateMessages from './InputUpdateMessages'
import iconPeople from '../images/icon-people.png'


export default function Messages(props) {
  const {name, messages, setMessages} = useContext(AuthContext)
  const [showAnswer, setShowAnswer] = useState(false);
  const [showButtonExit, setShowButtonExit] = useState(false);
  let blockForChat = showAnswer ? "right-block-with-riply" : "right-block-without-riply";
  
  /**Показує поле з повідомленням на яке відповідає користувач якщо в масиві повідомлень messages є повідомлення для відповіді */
  function fieldAnswerTo() {
    const answerTo = messages.find(message => message.answer === true);

    if (answerTo) {
      /**@return поле повідомлення на яке відповідає користувач*/
      return <div className="field-answer"><p>{answerTo.text}</p></div>
    }
  }

  /**
  *Створює список повідомлень з масиву messages
  *@param {messages} масив обєктів зі значеннями для створення списку повідомлень 
  */
  function renderMessages() {
    return messages.map((message, index) => {
      /**@return повідомлення користувача */
      return <Message key={message._id} message={message} />
    })
  }

  return (
    <MessagesContext.Provider value={{
      messages, 
      setMessages, 
      showAnswer, 
      setShowAnswer, 
      showButtonExit, 
      setShowButtonExit
    }}>
      <div className={blockForChat}>
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
    </MessagesContext.Provider>
  )
}



