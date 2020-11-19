import React, { useCallback, useMemo, useEffect } from 'react'
import {GET_MESSAGES} from '../../redux/types'
import { useDispatch, useSelector } from 'react-redux'
import {connect} from 'react-redux'
import {getData} from '../../redux/actions/actions.js'
import Message from '../Message/Message.jsx'
import MessageActionsPopup from '../MessageActionsPopup/MessageActionsPopup.jsx'
import './messages.sass'

export function Messages(props) {
  const { activeMessage, setActiveMessage, inputRef } = props
  const dispatch = useDispatch()
  const reduxMessages = useSelector(state => state.messages)
  const activeChannelId = useSelector(state => state.activeChannelId)
  const token = useSelector(state => state.token)
  const userId = useSelector(state => state.userData._id)

  useEffect(() => {
    async function getMessages() {
      await dispatch(getData(GET_MESSAGES, token, activeChannelId, {userId})) 
    }

    if ( activeChannelId && activeChannelId !== "1" ) getMessages()
  }, [activeChannelId])
  
  const reverseMsg = useMemo (() => {
    //console.log(reduxMessages)
    return reduxMessages === "403" ? "403" : reduxMessages.reverse() 
  }, [reduxMessages])

  const renderMessages = useCallback(() => {
    if (reduxMessages !== "403") {      
      return reverseMsg.map((message) => {
        return <Message 
            key={message._id || message.id} 
            message={message} 
            activeMessage={activeMessage}
            setActiveMessage={setActiveMessage}
        />
      })
    }
  }, [reverseMsg, activeMessage])

  return (
    <div className="messages">
      {renderMessages()}
      <MessageActionsPopup 
        activeMessage={activeMessage} 
        setActiveMessage={setActiveMessage} 
        inputRef={inputRef}
      />
    </div>
  )
}

const mapDispatchToProps = {
  getData 
}

export default connect(null, mapDispatchToProps)(Messages)