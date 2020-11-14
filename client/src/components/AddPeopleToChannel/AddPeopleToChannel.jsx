import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux'
import {connect} from 'react-redux'
import {postData} from '../../redux/actions/actions.js'
import {POST_ADD_PEOPLES_TO_CHANNEL} from '../../redux/types.js'
import {SelectPeople} from '../SelectPeople/SelectPeople.jsx'
import './add-people-to-channel.sass';


export function AddPeopleToChannel(props) {
  const dispatch = useDispatch()
  const token = useSelector(state => state.login.token)
  const newMember = useSelector(state => state.pushedMemberToChannel)
  const activeChannelId = useSelector(state => state.activeChannelId)
  const channels = useSelector(state => state.channels)
  const {
    isNotMembers,
  	setModalAddPeopleIsOpen,  
    invited,
    setInvited,
  } = props
  const [notInvited, setNotInvited] = useState([])
  const heightParrentDiv = 'set-channel__invite_height'

  useEffect(() => {
    if (isNotMembers[0]) setNotInvited(isNotMembers)
  }, [isNotMembers])

  function createMainLabel() {
    const activeChannel = channels.filter(channel => channel._id === activeChannelId)
    return !activeChannel[0] ? (
      <p className="set-channel-forms__main-label-text">
    		Invite people to #general
      </p>
    ) : activeChannel[0].name.match(/^#/) ? (
    	<p className="set-channel-forms__main-label-text">
    		Invite people to {`${activeChannel[0].name}`}
    	</p>
    ) : (
    	<p className="set-channel-forms__main-label-text">
    		Invite people to &#128274;{activeChannel[0].name}
    	</p>
    );
  }

  async function doneInvite(action) {
    if (action === "invite") {
      await dispatch( 
        postData(POST_ADD_PEOPLES_TO_CHANNEL, token, invited, activeChannelId) 
      )
    }
    //console.log(invited, notInvited)
    setNotInvited(isNotMembers)
    setInvited([])
    setModalAddPeopleIsOpen(false)
  }


	return (
		<div className="set-channel">
      <label>{createMainLabel()}</label>
      <SelectPeople 
        invited={invited}
        setInvited={setInvited}
        notInvited={notInvited}
        setNotInvited={setNotInvited}
        heightParrentDiv={heightParrentDiv}
      />

      <button 
      	className="set-channel__button" 
      	onClick={doneInvite}
      >
      	Close
      </button>

      <button 
      	type="submit"
      	className="set-channel__button" 
      	onClick={() => doneInvite("invite")}
      >
      	Invite
      </button>
    </div>
  )
}

const mapDispatchToProps = {
  postData 
}

export default connect(null, mapDispatchToProps)(AddPeopleToChannel)