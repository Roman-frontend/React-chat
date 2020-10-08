import React, {useState, useEffect, useRef, useCallback} from 'react';
import {useAuthContext} from '../../context/AuthContext.js';
import {useMessagesContext} from '../../context/MessagesContext.js';
import {useServer} from '../../hooks/Server.js';
import './select-people.sass'

export function SelectPeople(props) {
  const {name, userId} = useAuthContext();
  const {getUsers} = useServer();

  const {
    notParticipantsChannel,
    setNotParticipantsChannel,
    setInvited,
    invited,
    notInvited,
    setNotInvited,
    heightParrentDiv
  } = props

  const [focusSelectTag, setFocusSelectTag] = useState(false)

  const inputRef = useRef()

  const selectClassName = focusSelectTag ? 
    "set-channel-forms__list-peoples-invite_is-focus" : 
    "set-channel-forms__list-peoples-invite_is-not-focus";

  useEffect(() => {
    const tagInput = document.querySelector(".set-channel-forms__input-people-invite");
    const tagSelect = document.querySelector(`.${selectClassName}`);
    addEvents(tagInput)
    addEvents(tagSelect)
  }, [])

  function addEvents(tag) {
    const parrentDiv = document.querySelector(".set-channel");
    const tagInput = document.querySelector(".set-channel-forms__input-people-invite");
    const checkbox = document.getElementById("add-private-channel");
    const buttons = document.querySelectorAll(".set-channel__button");


    tag.addEventListener('focus', () => {
      parrentDiv.classList.add(heightParrentDiv)
      if (checkbox) checkbox.classList.add('set-channel-forms_top')
      buttons.forEach(button => button.classList.add('set-channel__button_top'))
      setFocusSelectTag(true)   
    });

    tag.addEventListener('blur', () => {
      parrentDiv.classList.remove(heightParrentDiv)
      if (checkbox) checkbox.classList.remove('set-channel-forms_top')
      buttons.forEach(button => button.classList.remove('set-channel__button_top'))
      if ( document.hasFocus(tagInput) ) setFocusSelectTag(false)
    });
  }


  const getSelectElements = useCallback(() => {
    if (!focusSelectTag) {
      return [<option key="1"></option>]

    } else if (notInvited) {
      return createSelectElements(notInvited)

    } else if (notParticipantsChannel) {
      return createSelectElements(notParticipantsChannel)
    }
  }, [focusSelectTag, notInvited])

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
    console.log("addPeopleToInvited")
    changeNoInvited(idElectPeople)
    setInvited(prev => {
      const allInvited = prev.concat(idElectPeople)
      return allInvited
    })
  }

  function changeNoInvited(idElectPeople) {
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
    setNotParticipantsChannel(noInvited)
  }

  function handleInput(event) {
    changeListPeoples()
    if (event.key === "Enter") addToInvitedInputPeople()
    setFocusSelectTag(true)
  }

  function changeListPeoples() {
    //const regExp = new RegExp(`^${inputRef.current.value}`)
    const regExp = new RegExp(`${inputRef.current.value}`)
    setNotInvited(() => {
      return notParticipantsChannel.filter(people => people.email.match(regExp) ? people : null)
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
          className="set-channel-forms__input-people-invite"
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