import React, {useState, useEffect, useRef} from 'react';
import {useMessagesContext} from '../../context/MessagesContext.js';
import {useServer} from '../../hooks/Server.js';
import {SelectPeople} from '../SelectPeople/SelectPeople.jsx'
import './add-people-to-channel.sass';


export function AddPeopleToChannel(props) {
  const { activeChannelId } = useMessagesContext();
  const { postData } = useServer();
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
  	const resInviting = await postData("postAddPeoplesToChannel", activeChannelId, invited)
    if (resInviting.dataMember) {
      const newMember = resInviting.dataMember
      setChannelMembers(prev => {
        const newArrMembers = prev.concat(newMember)
        return newArrMembers
      })
      setNotParticipantsChannel(beforeNoMembers => {
        const nowNoMembers = beforeNoMembers.filter(member => member._id !== newMember._id)
        return nowNoMembers
      })
    }
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