import React, { useState, useMemo } from 'react'
import Tippy from '@tippy.js/react'
import 'tippy.js/dist/tippy.css'
import {useDispatch, useSelector} from 'react-redux'
import {connect} from 'react-redux'
import {removeData} from '../../redux/actions/actions.js'
import { REMOVE_MESSAGE } from '../../redux/types.js'
import iconMore from '../../images/icon-more.png'
import './message-actions-popup.sass'

export function MessageActionsPopup(props) {
  const dispatch = useDispatch()
  const token = useSelector(state => state.login.token)
  const activeChannelId = useSelector(state => state.activeChannelId)
  const { activeMessage, setActiveMessage, inputRef } = props;
  const [idMessageForPopup, setIdMessageForPopup] = useState(null)

  const topPopupRelativeTopPage = useMemo(() => {
    if ( idMessageForPopup ) {
      return getPlaceTopElement(idMessageForPopup)
    }
  }, [idMessageForPopup])

  const topIconActionRelativeTopPage = useMemo(() => {
    if ( activeMessage.id ) {
      return getPlaceTopElement(activeMessage.id)
    }
  }, [activeMessage.id])

  function getPlaceTopElement(idElement) {
    const element = document.getElementById(idElement)
    return element.getBoundingClientRect().top + 3
  }

  const handleAnswer = () => {
    setIdMessageForPopup(null)
    const valueAnsweringActiveMessage = activeMessage.reply ? undefined : activeMessage.message;
    const object = Object.assign({}, {...activeMessage}, {reply: valueAnsweringActiveMessage})
    setActiveMessage({...object});
    inputRef.current.value = "";
  }

  const handleChange = () => {
    let valueChangingActiveMessage
    setIdMessageForPopup(null)

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
    setIdMessageForPopup(null)
    //const object = Object.assign({}, {...activeMessage}, {id: undefined})
    //setActiveMessage({...object});
    setActiveMessage({})
    await dispatch( removeData(REMOVE_MESSAGE, activeMessage.message._id, token, { activeChannelId }) );
  }

  function setViewIconActions() {
    if (topIconActionRelativeTopPage) {
      return (
        <Tippy content='Actions'>
          <img 
            className="chat-actions"
            style={{top: `${topIconActionRelativeTopPage}px`}} 
            src={iconMore} 
            onClick={() => setIdMessageForPopup(activeMessage.id)}
          />
        </Tippy>
      )
    }

    return null
  }

  function setViewPopup() {
    if (topPopupRelativeTopPage) {
      return (
        <div className="field-actions chat-actions" style={{top: `${topPopupRelativeTopPage}px`}} >
          <button className="field-actions__answer" onClick={handleAnswer} >Відповісти</button>
          <button className="field-actions__edit" onClick={handleChange} >Змінити</button>
          <button className="field-actions__redirect">Поділитись</button>
          <button className="field-actions__delete" onClick={handleDelete} >Видалити</button>
        </div>
      )
    }

    return null
  }

  return <>
    {setViewIconActions()}
    {setViewPopup()}
  </>
}

const mapDispatchToProps = {
  removeData 
}

export default connect(null, mapDispatchToProps)(MessageActionsPopup)