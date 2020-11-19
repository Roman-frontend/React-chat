import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import Modal from 'react-modal'
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {useDispatch, useSelector} from 'react-redux'
import {connect} from 'react-redux'
import {getData} from '../../redux/actions/actions.js'
import {GET_USERS} from '../../redux/types.js'
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import './ConversationHeader.sass'
Modal.setAppElement('#root')

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  addPeoples: {
    padding: theme.spacing(1),
    textAlign: 'center',
  },
}));

export function ConversationHeader(props) {
  const classes = useStyles();
  const dispatch = useDispatch()
  const users = useSelector(state => state.users)
  const channels = useSelector(state => state.channels)
  const userId = useSelector(state => state.userData._id)
  const token = useSelector(state => state.token)
  const activeChannelId = useSelector(state => state.activeChannelId)

	const [modalIsShowsMembers, setModalIsShowsMembers] = useState(false)
	const searchInputRef = useRef()
  

	useEffect(() => {
    async function getPeoples() {
      await dispatch( getData(GET_USERS, token, userId) )
    }

    getPeoples()
  }, [activeChannelId])

  const activeChannel = useMemo(() => {
    let channelForFilter = channels
    if (channels) {
      return channelForFilter.filter(channel => channel._id === activeChannelId)[0]
    }
    /* return activeChannelId !== 1 ?
      channelForFilter.filter(channel => channel._id === activeChannelId)[0] : null */
  }, [activeChannelId, channels])

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
      <Box className="conversation__header-members">
        <PeopleAltIcon
          style={{ fontSize: 40 }}
          onClick={() => setModalIsShowsMembers(true)}
        />
        <b>{ activeChannel ? activeChannel.members.length : 1 }</b>
      </Box>
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

    if (activeChannel && users) {
      const allUsers = users
    	activeChannel.members.forEach(memberId => {
        const filteredUsers = allUsers.filter( member => member._id === memberId )
	    	listMembers = listMembers.concat(filteredUsers)
		  })
	  }

	  return listMembers
  }

  function handleInput(event) {
  	const regExp = new RegExp(`${searchInputRef.current.value}`)
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
          <div className={classes.root}>
            <Grid container spacing={1}>
              <Grid item xs={1}>
                <PersonAddIcon 
                  className={classes.addPeoples}
                  style={{ fontSize: 40 }}
                />
              </Grid>
              <Grid>
                <p 
                  className={classes.addPeoples}
                  style={{ margin: 0, fontSize: 40 }} 
                >
                  Add people
                </p>
              </Grid>
            </Grid>
          </div>
      		<input 
	          placeholder="search people" 
	          className="set-channel-forms__input-people-invite set-channel-forms__input-people-invite_width"
	          type="text"
	          ref={searchInputRef}
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