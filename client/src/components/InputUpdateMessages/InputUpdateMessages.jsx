import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {connect} from 'react-redux'
import {postData, putData} from '../../redux/actions/actions.js'
import {POST_MESSAGE} from '../../redux/types.js'
import {useMessagesContext} from '../../context/MessagesContext.js'
import './input-message.sass'


export function InputUpdateMessages(props) {
  const dispatch = useDispatch()
  const reduxMessages = useSelector(state => state.messages)
  const name = useSelector(state => state.login.name)
  const userId = useSelector(state => state.login.userId)
  const token = useSelector(state => state.login.token)
  const { inputRef, activeChannelId } = useMessagesContext()
  const { activeMessage, setActiveMessage } = props


  const copyMessages = reduxMessages[0] ? reduxMessages.slice(0, reduxMessages.length) : []
  let updatedArrayMessages = []

  useEffect(() => { inputRef.current.focus() }, [])

  function inputUpdateMessages(event) {
    if ((event.key === "Enter") && !(inputRef.current.value === "")) {
      if (activeMessage.change) changeMessageText()
      else if (activeMessage.reply) messageInReply(inputRef.current.value)
      else newMessage(inputRef.current.value)
      console.log(updatedArrayMessages)  
      inputRef.current.value = null
    }
  }

  async function changeMessageText() {
    let putMessage = []

    updatedArrayMessages = reduxMessages.map(message => {
      if (message._id === activeMessage.change) {
        message.text = inputRef.current.value
        putMessage.push(message)
        return message
      } else return message
    })
    
    const resPut = await putData(putMessage[0], activeMessage.change, null, token)
    const object = Object.assign({}, {...activeMessage}, {'change': null})
    setActiveMessage({...object})
  }

  const messageInReply = async response => {
    copyMessages.unshift({
      id: Date.now(),
      userId,
      username: name, 
      text: activeMessage.reply.text, 
      createdAt: new Date().toLocaleString(), 
      channelId: activeChannelId,
      reply: response,
    },) 
   
    await dispatch( postData(POST_MESSAGE, token, { userId, ...copyMessages[0] }, activeChannelId) )

    updatedArrayMessages = copyMessages
    const object = Object.assign({}, {...activeMessage}, {reply: null})
    setActiveMessage({...object}) 
  }

  async function newMessage(textMessage) {
    
    copyMessages.unshift({
      id: Date.now(),
      userId,
      username: name, 
      text: textMessage, 
      createdAt: new Date().toLocaleString(),
      channelId: activeChannelId,
    }, )  

    await dispatch( postData(POST_MESSAGE, token, { userId, ...copyMessages[0] }, activeChannelId) )

    updatedArrayMessages = copyMessages
  }

  return (
    <input 
      type="text" 
      className="conversation-input__input" 
      placeholder="Enter Text" 
      ref={inputRef} 
      onKeyUp={event => inputUpdateMessages(event)}
    />
  )
}

const mapDispatchToProps = {
  postData, putData
}

export default connect(null, mapDispatchToProps)(InputUpdateMessages)