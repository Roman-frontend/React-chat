import React, {useState, useEffect} from 'react';
import {useAuthContext} from '../../context/AuthContext.js';
import {useMessagesContext} from '../../context/MessagesContext.js';
import {useServer} from '../../hooks/Server.js';
import './add-people-to-channel.sass';


export function AddPeopleToChannel(props) {
  const {name, userId} = useAuthContext();
  const { activeChannelId } = useMessagesContext();
  const {getUsers, postAddPeoplesToChannel} = useServer();
  const {
  	setModalAddPeopleIsOpen, 
  	channelName, 
  	notParticipantsChannel, 
  	channelMembers
  } = props

  const [form, setForm] = useState({people: ''})
  const [invitedPeoples, setInvitedPeoples] = useState([])
  const [focusSelectPeople, setFocusSelectPeople] = useState(false)
  const [peoplesNotInvited, setPeoplesNotInvited] = useState(null)

  useEffect(() => {
  	const listPeoplesForInvite = document.querySelector(".set-channel-forms__list-peoples-invite");
		const parrentBlock = document.querySelector(".set-channel");
		const buttons = document.querySelectorAll(".set-channel__button");

		function pp(a) {
			alert(a)
		}

  	listPeoplesForInvite.addEventListener('focus', (event) => {
  		buttons.forEach(button => {
  			button.classList.add('set-channel__button_top')
  		})
  		parrentBlock.classList.add('set-channel_height')
		  setFocusSelectPeople(true)   
		});

		listPeoplesForInvite.addEventListener('blur', (event) => {
		  buttons.forEach(button => {
		  	button.classList.remove('set-channel__button_top')
		  })
		  parrentBlock.classList.remove('set-channel_height')
		  setFocusSelectPeople(false)
		});

  }, [])

  function createMainLabel() {
    if(channelName.match(/^#/)) {
    	return (
    		<p className="set-channel-forms__main-label-text">Invite people to {`${channelName}`}</p>
    	)
    } else {
    	return (
    		<p className="set-channel-forms__main-label-text">Invite people to &#128274;{channelName}</p>
    	)
    }
  }

  const changeHandler = event => {
  	const regExp = new RegExp(`^${event.target.value}`)
  	console.log(event.cancelable)
    setForm({people: event.target.value})
  }

  function getPeopleNames() {
  	if (peoplesNotInvited) {
  		return createElementsSelectPeoples(peoplesNotInvited)

  	} else if (notParticipantsChannel) {
  		return createElementsSelectPeoples(notParticipantsChannel)
  	}
  }

  function createElementsSelectPeoples(peoplesNoInvited) {
		const listPeoplesInvite = peoplesNoInvited.map(people => { 
  		return (
  			<option 
	  			key={people._id} 
	  			label={people.email} 
	  			value={people.email}
	  			onClick={peopleId => addPeopleToInvited(people._id) }
	  		></option> 
	  	)
  	})

  	return [<option key="1"></option>].concat(listPeoplesInvite)
	}

  async function doneCreate() {
  	await postAddPeoplesToChannel(`/api/channel/post-add-members-to-channel${activeChannelId}`, invitedPeoples)
  	setModalAddPeopleIsOpen(false)
  }

  function addPeopleToInvited(idElectPeople) {
  	let noInvited = notParticipantsChannel;
  	const allInvitedPeoples = invitedPeoples.concat(idElectPeople);

  	if (focusSelectPeople) {
  		allInvitedPeoples.forEach(peopleId => {
  			noInvited = noInvited.filter(people => people._id !== peopleId)
  		})
  	}
  	console.log(noInvited)
  	console.log(invitedPeoples)
  	setInvitedPeoples(prev => prev.concat(idElectPeople))
  	setPeoplesNotInvited(noInvited)
  }

  function inputUpdateMessages(event) {
  	console.log(event.key)
  }

  console.log(channelMembers, notParticipantsChannel)


	return (
		<div className="set-channel">

      <form className="set-channel__main-label">
      	<label>{createMainLabel()}</label>

	      	<div className="set-channel-forms">
	          <label className="set-channel-forms__label">Add a people</label>
	          <input 
	            placeholder="add peoples to channel" 
	            className="set-channel-forms__input"
	            type="text"
	            id="people"
	            name="people"
	            value={form.people}
	            onChange={changeHandler} 
	            onKeyUp={event => inputUpdateMessages(event)}
	          />
	        </div>

	        <div className="set-channel-forms">
	        	<label className="set-channel-forms__label">List peoples</label>
	        	<select 
	        		className="set-channel-forms__list-peoples-invite" 
	        		name="peoples" 
	        		id="peoples" 
	        		size="3" 
	        		multiple
	        	>
		        	{getPeopleNames()}
	        	</select>
	        </div>

	      <button 
	      	className="set-channel__button" 
	      	onClick={() => setModalAddPeopleIsOpen(false)}
	      >
	      	Close
	      </button>

	      <button 
	      	type="submit"
	      	className="set-channel__button" 
	      	onClick={doneCreate}
	      >
	      	Invite
	      </button>

      </form>
    </div>
  )
}