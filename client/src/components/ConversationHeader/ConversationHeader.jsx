import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import Modal from 'react-modal'
import {useDispatch, useSelector} from 'react-redux'
import {connect} from 'react-redux'
import {getData} from '../../redux/actions/actions.js'
import {GET_USERS} from '../../redux/types.js'
import iconPeople from '../../images/icon-people.png'
import './ConversationHeader.sass'
Modal.setAppElement('#root')

export function ConversationHeader(props) {
  const dispatch = useDispatch()
  const users = useSelector(state => state.users)
  const channels = useSelector(state => state.channels)
  const userId = useSelector(state => state.login.userId)
  const token = useSelector(state => state.login.token)
  const activeChannelId = useSelector(state => state.activeChannelId)

	const [modalIsShowsMembers, setModalIsShowsMembers] = useState(false)
	const inputRef = useRef()
  

	useEffect(() => {
    async function getPeoples() {
      await dispatch( getData(GET_USERS, token, userId) )
    }

    getPeoples()
  }, [activeChannelId])

  const activeChannel = useMemo(() => {
    let channelForFilter = channels
    return activeChannelId !== 1 ?
      channelForFilter.filter(channel => channel._id === activeChannelId)[0] : null
  }, [activeChannelId])

  const headerPopup = useMemo(() => {
    return <p style={{margin: 0}}>
      { activeChannel ? activeChannel.members.length : 1} members in 
      {activeChannel ? `#${activeChannel.name}` : "#general"}
    </p>
  }, [activeChannel])

  const createName = useCallback(() => {
    return (
      <b 
        className="conversation__name">
        ✩ {activeChannel ? activeChannel.name : "general"}
      </b>
    )
  }, [activeChannel])

  const createMembers = useCallback(() => {
    return (
      <div className="conversation__header-members">
        <img 
          className="conversation__icon-member" 
          src={iconPeople} 
          alt="icon-user" 
          onClick={() => setModalIsShowsMembers(true)}
        />
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
      const allUsers = users
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

  //console.log(modalIsShowsMembers)

	return (
    <div className="conversation__field-name" >
      {createName()}
      {createMembers()}
      <Modal 
        isOpen={modalIsShowsMembers}
        onRequestClose={() => setModalIsShowsMembers(false)}
        className={"modal-content"}
        overlayClassName={"modal-overlay-conversation-header-members"}
      >
      	<div className="set-channel">
          { headerPopup }
          <button 
            className="set-channel__button set-channel__button_left_bottom" 
            onClick={() => setModalIsShowsMembers(false) }
          >
            Close
          </button>
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

const mapDispatchToProps = { getData }

export default connect(null, mapDispatchToProps)(ConversationHeader)