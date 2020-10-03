import React, {useState, useEffect, useRef} from 'react';
import {useAuthContext} from '../../context/AuthContext.js';
import {useMessagesContext} from '../../context/MessagesContext.js';
import {useServer} from '../../hooks/Server.js';

export function SelectPeople(props) {
  const {name, userId} = useAuthContext();
  const {getUsers} = useServer();

  const {
    notParticipantsChannel,
    setNotParticipantsChannel,
    setInvited,
    invited,
    heightParrentDiv
  } = props

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
      parrentDiv.classList.add(heightParrentDiv)
      setFocusSelectTag(true)   
    });

    tag.addEventListener('blur', () => {
      buttons.forEach(button => button.classList.remove('set-channel__button_top'))
      parrentDiv.classList.remove(heightParrentDiv)
      if ( document.hasFocus(tagInput) ) setFocusSelectTag(false)
    });
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
		<>
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
		</>
	)
}