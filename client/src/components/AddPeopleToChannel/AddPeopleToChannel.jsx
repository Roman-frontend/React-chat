import React, {useState, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux'
import {connect} from 'react-redux'
import {postData} from '../../redux/actions/actions.js'
import {POST_ADD_PEOPLES_TO_CHANNEL} from '../../redux/types.js'
import {useAuthContext} from '../../context/AuthContext.js'
import {useMessagesContext} from '../../context/MessagesContext.js';
import {SelectPeople} from '../SelectPeople/SelectPeople.jsx'
import './add-people-to-channel.sass';


export function AddPeopleToChannel(props) {
  const dispatch = useDispatch()
  const newMember = useSelector(state => state.pushedMemberToChannel)
  const { token } = useAuthContext();
  const { activeChannelId } = useMessagesContext();
  const {
  	setModalAddPeopleIsOpen, 
  	channelName, 
  	notParticipantsChannel,
  	setNotParticipantsChannel,
    invited,
    setInvited,
    setChannelMembers
  } = props
  const [notInvited, setNotInvited] = useState(notParticipantsChannel)
  const heightParrentDiv = 'set-channel__invite_height'

  useEffect(() => {
    if (newMember) {
      setChannelMembers(prev => {
        const newArrMembers = prev.concat(newMember.dataMember)
        return newArrMembers
      })
      setNotParticipantsChannel(beforeNoMembers => {
        const nowNoMembers = beforeNoMembers.filter(member => member._id !== newMember.dataMember._id)
        return nowNoMembers
      })
    }
  }, [newMember])

  function createMainLabel() {
    return channelName.match(/^#/) ? (
    	<p className="set-channel-forms__main-label-text">
    		Invite people to {`${channelName}`}
    	</p>
    ) : (
    	<p className="set-channel-forms__main-label-text">
    		Invite people to &#128274;{channelName}
    	</p>
    );
  }

  async function doneInvite() {
  	await dispatch( postData(POST_ADD_PEOPLES_TO_CHANNEL, token, invited, activeChannelId) )
    setModalAddPeopleIsOpen(false)
  }

  function closeInvite() {
    setNotInvited(notParticipantsChannel)
    setInvited([])
    setModalAddPeopleIsOpen(false)
  }


	return (
		<div className="set-channel">
      <label>{createMainLabel()}</label>
    	<SelectPeople 
        notParticipantsChannel={notParticipantsChannel}
        setNotParticipantsChannel={setNotParticipantsChannel}
        invited={invited}
        setInvited={setInvited}
        notInvited={notInvited}
        setNotInvited={setNotInvited}
        heightParrentDiv={heightParrentDiv}
      />

      <button 
      	className="set-channel__button" 
      	onClick={closeInvite}
      >
      	Close
      </button>

      <button 
      	type="submit"
      	className="set-channel__button" 
      	onClick={doneInvite}
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