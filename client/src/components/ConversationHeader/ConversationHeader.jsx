import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import Modal from 'react-modal'
import {useAuthContext} from '../../context/AuthContext.js'
import {useMessagesContext} from '../../context/MessagesContext.js'
import {useServer} from '../../hooks/Server.js'
import iconPeople from '../../images/icon-people.png'
import './ConversationHeader.sass'
Modal.setAppElement('#root')

export function ConversationHeader(props) {
	const { userId, token } = useAuthContext();
	const { activeChannelId, dataChannels, isBlockedInput } = useMessagesContext()
	const { getData } = useServer();
	const [allUsers, setAllUsers] = useState(null)
	const [modalIsShowsMembers, setModalIsShowsMembers] = useState(false)
	const inputRef = useRef()


	useEffect(() => {
    async function getPeoples() {
      const serverUsers = await getData("getUsers", token, userId)
      if (serverUsers) { setAllUsers(serverUsers.users) }
    }

    getPeoples()
  }, [activeChannelId])

  const activeChannel = useMemo(() => {
    return activeChannelId !== 1 ?
      dataChannels.filter(channel => channel._id === activeChannelId)[0] : null

  }, [activeChannelId])

  const createName = useCallback(() => {
    return activeChannel ? 
      <b className={`conversation__name`}>✩ {activeChannel.name}</b> :
      <b className={`conversation__name`}>✩ general</b>
  }, [activeChannel])

  const createMembers = useCallback(() => {
    return (
      <div className="conversation__header-members">
        <img className="conversation__icon-member" src={iconPeople} alt="icon-user" />
        <b>{ activeChannel ? activeChannel.members.length : 1 }</b>
      </div>
    )
  }, [activeChannel])

  const createListMembers = useCallback(() => {
    const listMembers = getMembersActiveChannel()

	  return listMembers.map(member => {
		  return (
	      <div key={member._id} id={member._id} className="user-sets__people">
	        <b className="main-font user-sets__people_color">{member.email}</b>
	      </div>
	    )
		})
  }, [activeChannel])

  function getMembersActiveChannel() {
		let listMembers = []

    if (activeChannel) {
    	activeChannel.members.forEach(memberId => {
	    	const filteredUsers = allUsers.filter( member => member._id === memberId )
	    	listMembers = listMembers.concat(filteredUsers)
		  })
	  }

	  return listMembers
  }

  function handleInput(event) {
  	const regExp = new RegExp(`${inputRef.current.value}`)
  }

	return (
		<div className="conversation__field-name" onClick={() => setModalIsShowsMembers(true)}>
      {createName()}
      {createMembers()}
      <Modal 
        isOpen={modalIsShowsMembers}
        onRequestClose={() => setModalIsShowsMembers(false)}
        className={"modal-content"}
        overlayClassName={"modal-overlay-conversation-header-members"}
      >
      	<div className="set-channel">
      		<p style={{margin: 0}}>{activeChannel ? activeChannel.name : "#general"}</p>
      		<p>Add people</p>
      		<input 
	          placeholder="search people" 
	          className="set-channel-forms__input-people-invite set-channel-forms__input-people-invite_width"
	          type="text"
	          ref={inputRef}
	          onKeyUp={event => handleInput(event)}
	        />
      		{createListMembers()}
      	</div>
      </Modal>
    </div>
  )
}