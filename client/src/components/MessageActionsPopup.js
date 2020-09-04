import React, {useEffect, useState, useCallback} from 'react'
import Tippy from '@tippy.js/react'
import 'tippy.js/dist/tippy.css'
import {useMessagesContext} from '../context/MessagesContext'
import {useServer} from '../hooks/Server'
import iconMore from '../images/icon-more.png'

export default function MessageActionsPopup(props) {
  const { removeData } = useServer();
  const { inputRef } = useMessagesContext();
  const { activeMessage, setActiveMessage } = props;
  const [block, setBlock] = useState(true)
  let element = document.getElementById(activeMessage.id)
  let topActiveMessageRelativeTopPage = null

  if (element) topActiveMessageRelativeTopPage = element.getBoundingClientRect().top + 3

  useEffect(() => {
    setBlock(true)
  }, [activeMessage.id])

  const handleAnswer = () => {
    setBlock(false)
    const valueAnsweringActiveMessage = activeMessage.answering ? undefined : activeMessage.message;
    const object = Object.assign({}, {...activeMessage}, {answering: valueAnsweringActiveMessage})
    setActiveMessage({...object});
    inputRef.current.value = "";
  }

  const handleChange = () => {
    let valueChangingActiveMessage
    setBlock(false)

    if (activeMessage.changing) {
      valueChangingActiveMessage = undefined;
      inputRef.current.value = '';

    } else {
      valueChangingActiveMessage = activeMessage.message;
      inputRef.current.value = activeMessage.message.text;
    }

    const object = Object.assign({}, {...activeMessage}, {changing: valueChangingActiveMessage})
    setActiveMessage({...object});
  }

  const handleDelete = () => {
    setBlock(false)
    removeData(activeMessage.message);
  }

  if (block) {
    return (
      <Tippy content='more actions'>
        <img 
          className="actions"
          style={{top: `${topActiveMessageRelativeTopPage}px`}} 
          src={iconMore} 
          onClick={() => setBlock(false)}
        />
      </Tippy>
    )
  }
  return (
    <div className="change-mes actions" style={{top: `${topActiveMessageRelativeTopPage}px`}}>
      <button className="answer-mes" onClick={handleAnswer} >Відповісти</button>
      <button className="edit-mes" onClick={handleChange} >Змінити</button>
      <button className="redirect-mes">Поділитись</button>
      <button className="delete-mes" onClick={handleDelete} >Видалити</button>
    </div>
  )
}