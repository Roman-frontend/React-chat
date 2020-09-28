import React, {useState, useEffect, useRef} from 'react';
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
  	setNotParticipantsChannel,
  	channelMembers
  } = props

  const [invited, setInvited] = useState([])
  const [notInvited, setNotInvited] = useState(notParticipantsChannel)
  const [focusSelectTag, setFocusSelectTag] = useState(false)

  const inputRef = useRef()

  const selectClassName = focusSelectTag ? 
  	"set-channel-forms__list-peoples-invite_is-focus" : 
  	"set-channel-forms__list-peoples-invite_is-not-focus";

  useEffect(() => {
  	const tagInput = document.querySelector(".set-channel-forms__input");
  	const tagSelect = document.querySelector(`.${selectClassName}`);
  	addEvents(tagInput)
  	addEvents(tagSelect)
  }, [])

  function addEvents(tag) {
  	const parrentDiv = document.querySelector(".set-channel");
  	const tagInput = document.querySelector(".set-channel-forms__input");
		const buttons = document.querySelectorAll(".set-channel__button");


		tag.addEventListener('focus', () => {
  		buttons.forEach(button => button.classList.add('set-channel__button_top'))
  		parrentDiv.classList.add('set-channel_height')
		  setFocusSelectTag(true)   
		});

		tag.addEventListener('blur', () => {
  		buttons.forEach(button => button.classList.remove('set-channel__button_top'))
  		parrentDiv.classList.remove('set-channel_height')
		  if ( document.hasFocus(tagInput) ) setFocusSelectTag(false)
		});
  }

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

  function getSelectElements() {
  	console.log("getSelect ", !focusSelectTag)
  	if (!focusSelectTag) {
  		return [<option key="1"></option>]

  	} else if (notInvited) {
  		return createSelectElements(notInvited)

  	} else if (notParticipantsChannel) {
  		return createSelectElements(notParticipantsChannel)
  	} 
	}

	function createSelectElements(arrPeoples) {
		return arrPeoples.map(people => { 
  		return (
  			<option 
	  			key={people._id} 
	  			label={people.email} 
	  			value={people.email}
	  			onClick={peopleId => addPeopleToInvited(people._id) }
	  		></option> 
	  	)
  	})
	}

  async function doneCreate() {
  	console.log(invited)
  	await postAddPeoplesToChannel(`/api/channel/post-add-members-to-channel${activeChannelId}`, invited)
  	setModalAddPeopleIsOpen(false)
  }

  function addPeopleToInvited(idElectPeople) {
  	if (focusSelectTag) {
  		console.log("addPeopleToInvited")
  		const allInvited = invited.concat(idElectPeople);

  		if (notInvited) {
	  		setNotInvited(prevPeoples => {
			  	let noInvited = prevPeoples;
		  		allInvited.forEach(peopleId => { noInvited = noInvited.filter(people => people._id !== peopleId) })
		  		return noInvited
  			})
  		}
	  	let noInvited = notParticipantsChannel;
  		allInvited.forEach(peopleId => { noInvited = noInvited.filter(people => people._id !== peopleId) })

  		setInvited(prev => prev.concat(idElectPeople))
  		setNotParticipantsChannel(noInvited)
  	}
  }

  function handleInput(event) {
  	changeListPeoples()
  	if (event.key === "Enter") addToInvitedInputPeople()

    setFocusSelectTag(true)
  }

  function changeListPeoples() {
  	const regExp = new RegExp(`^${inputRef.current.value}`)

		setNotInvited(peoples => {
			let matchingEmailes = []
			notParticipantsChannel.forEach(people => {
				if ( people.email.match(regExp) ) matchingEmailes.push(people)
			})
			return matchingEmailes
    })
  }

  function addToInvitedInputPeople() {
  	let peoplesHasInputEmail = []
  	notParticipantsChannel.forEach(people => { 
  		if (people.email === inputRef.current.value) peoplesHasInputEmail = people._id
  	})

  	addPeopleToInvited(peoplesHasInputEmail)
  	inputRef.current.value = ""
  }


	return (
		<div className="set-channel">
      <label>{createMainLabel()}</label>
    	<div className="set-channel-forms">
        <label className="set-channel-forms__label">Add a people</label>
        <input 
          placeholder="add peoples to channel" 
          className="set-channel-forms__input"
          type="text"
          ref={inputRef}
          onKeyUp={event => handleInput(event)}
        />
      </div>

	   	<form>
        <div className="set-channel-forms">
        	<label className="set-channel-forms__label">List peoples</label>
        	<select 
        		className={selectClassName} 
        		name="peoples" 
        		id="peoples" 
        		size="3" 
        		multiple
        		onClick={() => setFocusSelectTag(true)}
        	>
	        	{getSelectElements()}
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