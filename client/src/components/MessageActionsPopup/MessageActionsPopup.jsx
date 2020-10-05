import React, {useEffect, useState} from 'react'
import Tippy from '@tippy.js/react'
import 'tippy.js/dist/tippy.css'
import {useMessagesContext} from '../../context/MessagesContext.js'
import {useServer} from '../../hooks/Server.js'
import iconMore from '../../images/icon-more.png'
import './message-actions-popup.sass'

export default function MessageActionsPopup(props) {
  const { removeData } = useServer();
  const { messages, setMessages, inputRef } = useMessagesContext();
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
    const valueAnsweringActiveMessage = activeMessage.reply ? undefined : activeMessage.message;
    const object = Object.assign({}, {...activeMessage}, {reply: valueAnsweringActiveMessage})
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

  const handleDelete = async () => {
    setBlock(false)
    const object = Object.assign({}, {...activeMessage}, {id: undefined})
    setActiveMessage({...object});
    const removeMessage = await removeData(activeMessage.message._id);
    const isComplitedRemove = removeMessage.removed
    if (isComplitedRemove) {
      const newArrMessages = messages.filter(message => message._id !== activeMessage.message._id)
      setMessages(newArrMessages)
    }
  }

  if (block) {
    return (
      <Tippy content='Actions'>
        <img 
          className="chat-actions"
          style={{top: `${topActiveMessageRelativeTopPage}px`}} 
          src={iconMore} 
          onClick={() => setBlock(false)}
        />
      </Tippy>
    )
  }
  return (
    <div className="field-actions chat-actions" style={{top: `${topActiveMessageRelativeTopPage}px`}} >
      <button className="field-actions__answer" onClick={handleAnswer} >Відповісти</button>
      <button className="field-actions__edit" onClick={handleChange} >Змінити</button>
      <button className="field-actions__redirect">Поділитись</button>
      <button className="field-actions__delete" onClick={handleDelete} >Видалити</button>
    </div>
  )
}