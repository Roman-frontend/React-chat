import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import "./select-people.sass";

export function SelectPeople(props) {
  const {
    invited,
    setInvited,
    notInvited,
    setNotInvited,
    parrentDivRef,
    checkboxRef,
    buttonCloseRef,
    buttonDoneRef,
    heightParrentDiv,
  } = props;
  const [focusSelectTag, setFocusSelectTag] = useState(false);
  const [listMatchedEmails, setListMatchedEmails] = useState(notInvited);
  const users = useSelector((state) => state.users);
  const inputPeopleRef = useRef();
  const selectRef = useRef();

  const selectClassName = focusSelectTag
    ? "set-channel-forms__list-peoples-invite_is-focus"
    : "set-channel-forms__list-peoples-invite_is-not-focus";

  useEffect(() => {
    function addEvents(tag) {
      tag.addEventListener("focus", () => {
        parrentDivRef.current.classList.add(heightParrentDiv);
        if (checkboxRef)
          checkboxRef.current.classList.add("set-channel-forms_top");
        buttonCloseRef.current.classList.add("set-channel__button_top");
        buttonDoneRef.current.classList.add("set-channel__button_top");
        setFocusSelectTag(true);
      });

      tag.addEventListener("blur", () => {
        parrentDivRef.current.classList.remove(heightParrentDiv);
        if (checkboxRef)
          checkboxRef.current.classList.remove("set-channel-forms_top");
        buttonCloseRef.current.classList.remove("set-channel__button_top");
        buttonDoneRef.current.classList.remove("set-channel__button_top");
        if (document.hasFocus(inputPeopleRef.current)) setFocusSelectTag(false);
      });
    }

    addEvents(inputPeopleRef.current);
    addEvents(selectRef.current);
  }, []);

  const getSelectElements = useCallback(() => {
    return !focusSelectTag
      ? [<option key="1"></option>]
      : listMatchedEmails
      ? createSelectElements(listMatchedEmails)
      : null;
  }, [focusSelectTag, listMatchedEmails]);

  function createSelectElements(peoplesForChoice) {
    return peoplesForChoice.map((people) => {
      return (
        <option
          key={people._id}
          label={people.email}
          value={people.email}
          onClick={() => addPeopleToInvited(people._id)}
        ></option>
      );
    });
  }

  function addPeopleToInvited(idElectPeople) {
    changeListNoInvited(idElectPeople);
    setListMatchedEmails((prevList) => {
      return prevList.filter((people) => people._id !== idElectPeople);
    });
    if (users) {
      const electData = users.filter((user) => user._id === idElectPeople);
      setInvited((prev) => prev.concat(electData));
    }
  }

  function changeListNoInvited(idElectPeople) {
    const allInvited = invited.concat(idElectPeople);
    setNotInvited((prevPeoples) => {
      let noInvited;
      allInvited.forEach((peopleId) => {
        noInvited = prevPeoples.filter((people) => people._id !== peopleId);
      });
      return noInvited;
    });
  }

  function handleInput(event) {
    changeListPeoples();
    if (event.key === "Enter") {
      addToInvitedInputPeople();
      setListMatchedEmails(null);
    }
    setFocusSelectTag(true);
  }

  function changeListPeoples() {
    const regExp = new RegExp(`${inputPeopleRef.current.value}`);
    setListMatchedEmails((prevList) => {
      return prevList.filter((people) =>
        people.email.match(regExp) ? people : undefined
      );
    });
  }

  function addToInvitedInputPeople() {
    const electPeople = listMatchedEmails.filter(
      (people) => people.email === inputPeopleRef.current.value
    );
    addPeopleToInvited(electPeople[0]._id);
    inputPeopleRef.current.value = "";
  }

  return (
    <>
      <div className="set-channel-forms">
        <label className="set-channel-forms__label">Add a people</label>
        <input
          placeholder="add peoples to channel"
          className="set-channel-forms__input-people-invite"
          type="text"
          ref={inputPeopleRef}
          onKeyUp={(event) => handleInput(event)}
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
          ref={selectRef}
          onClick={() => setFocusSelectTag(true)}
        >
          {getSelectElements()}
        </select>
      </div>
    </>
  );
}
