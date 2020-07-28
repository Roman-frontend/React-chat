import React, {useContext} from 'react'
import {useServer} from '../hooks/Server'
import {AuthContext} from '../context/AuthContext'
import {Context} from '../context/context'
import iconMore from '../images/icon-more.png'

export default function EditMessage(props) {
  const {removeData} = useServer();
  const {userId} = useContext(AuthContext)
  const {_id} = props.message;
  const {message} = props;
  const {
    messages, 
    setMessages, 
    setShowAnswer, 
    inputRef, 
    showButtonExit, 
    setShowButtonExit
  } = useContext(Context);

  function change() {
    setMessages(changeMessages())
    setShowAnswer(false)
  }

  function answer(_id) {
    const answerTo = messages.map(message => {
      if (message._id === _id) {
        message.answer = !message.answer
        message.changed = false
        setShowAnswer(message.answer)
        return message
      } else { 
        message.answer = false
        message.changed = false
        return message
      }
    })
    if (showButtonExit) setShowButtonExit(false)
    setMessages(answerTo)
    inputRef.current.value = ""
  }

  function changeMessages() {
    const changeMas = messages.map(message => {
      if (message._id === _id) {
        message.changed = !message.changed;
        message.answer = false
        inputRef.current.value = message.text
        return message
      } else {
        message.answer = false
        return message
      }
    })
    return changeMas
  }

  /**Визначає показувати список для дій над повідомленням чи значак для активації списку */
  function sets() {
    if (message.listAction) {
  	  return (
  	  	<div className="change-mes">

  	  	  <button className="answer-mes" 
          onClick={(_id) => answer(message._id)}
          >
          Відповісти
          </button>

  	  	  <button className="edit-mes" onClick={change}>
            Змінити
          </button>

  	  	  <button className="redirect-mes">Поділитись</button>
  	  	  <button className="delete-mes" 
          onClick={userId, setMessages, messages, _id, messagge => removeData(userId, setMessages, messages, props.message._id, message)}>Видалити</button>
  	  	</div>
  	  )
    } else return <img src={iconMore} alt="icon-user"/>
  }

  return sets()
}