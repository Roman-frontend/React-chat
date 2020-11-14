import React, {useState, useEffect, useMemo, useRef, useCallback} from 'react';
import {useSelector} from 'react-redux'
import './select-people.sass'

export function SelectPeople(props) {

  const {
    isNotMembers,
    setInvited,
    invited,
    notInvited,
    setNotInvited,
    heightParrentDiv
  } = props
  const [focusSelectTag, setFocusSelectTag] = useState(false)
  const [listMatchedEmails, setListMatchedEmails] = useState(null)
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
    console.log(listMatchedEmails)
    return !focusSelectTag ? [<option key="1"></option>] : 
      listMatchedEmails || listMatchedEmails === undefined ? createSelectElements(listMatchedEmails) : 
      notInvited ? createSelectElements(notInvited) : null
  }, [focusSelectTag, notInvited, listMatchedEmails])

  function createSelectElements(peoplesForChoice) {
    return peoplesForChoice.map(people => { 
      return (
        <option 
          key={people._id} 
          label={people.email} 
          value={people.email}
          onClick={() => addPeopleToInvited(people._id) }
        ></option> 
      )
    })
  }

  function addPeopleToInvited(idElectPeople) {
    changeListNoInvited(idElectPeople)
    setInvited( prev => prev.concat(idElectPeople) )
  }

  function changeListNoInvited(idElectPeople) {
    const allInvited = invited.concat(idElectPeople);
    setNotInvited(prevPeoples => {
      let noInvited = prevPeoples ? prevPeoples : isNotMembers
      allInvited.forEach(peopleId => { noInvited = noInvited.filter(people => people._id !== peopleId) })
      return noInvited
    })
  }

  function handleInput(event) {
    changeListPeoples()
    if (event.key === "Enter") //addToInvitedInputPeople()
    setFocusSelectTag(true)
  }

  //Зайнятися пізніше - по введеному тексті перевіряє співпадіння з користувачами списку
  function changeListPeoples() {
    const regExp = new RegExp(`${inputRef.current.value}`)
    setListMatchedEmails(() => { 
      return notInvited.filter(people => people.email.match(regExp) ? people : undefined) 
    })
  }

  //Зайнятися пізніше - по введеному тексті перевіряє співпадіння з користувачами списку
  function addToInvitedInputPeople() {
    let peoplesHasInputEmail = []
    notInvited.forEach(people => { 
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