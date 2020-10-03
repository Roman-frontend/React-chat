import React, {useState, useEffect, useRef} from 'react';
import {useAuthContext} from '../../context/AuthContext.js';
import {useMessagesContext} from '../../context/MessagesContext.js';
import {useServer} from '../../hooks/Server.js';
import {SelectPeople} from '../SelectPeople/SelectPeople.jsx'
import './add-people-to-channel.sass';


export function AddPeopleToChannel(props) {
  const { activeChannelId } = useMessagesContext();
  const {postAddPeoplesToChannel} = useServer();
  const {
  	setModalAddPeopleIsOpen, 
  	channelName, 
  	notParticipantsChannel,
  	setNotParticipantsChannel,
  	channelMembers,
    invited,
    setInvited,
    setChannelMembers
  } = props
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
    )
  }

  async function doneInvite() {
  	console.log("invited ", invited)
  	const resInviting = await postAddPeoplesToChannel(`/api/channel/post-add-members-to-channel${activeChannelId}`, invited)
    if (resInviting) {
      setChannelMembers(prev => {
        const newArrMembers = prev.concat(resInviting)
        console.log("channelMembers ", newArrMembers)
        return newArrMembers
      })
    }
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
        heightParrentDiv={heightParrentDiv}
      />

      <button 
      	className="set-channel__button" 
      	onClick={() => setModalAddPeopleIsOpen(false)}
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