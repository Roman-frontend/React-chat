import React, {useEffect, useRef, useState} from 'react'
import {Link} from 'react-router-dom'
import {AuthContext} from '../context/AuthContext'
import {useServer} from '../hooks/Server'

export function ChoiceChannel(props) {
  const {postData} = useServer()
  const inputRef = useRef(null);
  const [showBlockCreateChannel, setShowBlockCreateChannel] = useState(false)
  const [showBlockAddPeople, setShowBlockAddPeople] = useState(false)
  const [form, setForm] = useState({
    name: '', discription: '', people: ''
  })

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const changeHandler = event => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  function openCloseBlockCreateChannel() {
    setShowBlockCreateChannel(!showBlockCreateChannel)
  }

  function addPeopleToChannel() {
    setShowBlockAddPeople(true)
    setShowBlockCreateChannel(false)
  }

  const doneCreateChannel = () => {
    setShowBlockAddPeople(false)
    postData(`/api/channel/post-channel`, form)
    console.log("form.name, form.discription - ", form.name, form.discription, form.people)
  }

  function createChannel() {

    if (showBlockCreateChannel) {

      return (
        <>
          <button className="button-create-channel" onClick={openCloseBlockCreateChannel}>Create channel</button>
          <div className="block-create-channel">

            <div>
              <span className="title-create-channel">Create a channel</span>
              <p className="discription-of-create-channel">
                Channels are where your team communicates. They’re best when organized around a topic — #marketing, for example.
              </p>
              <label><b className="label-name-channel">Name</b></label>
              <input 
              placeholder="input-name-channel" 
              className="input-name-channel"
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={changeHandler} 
              />
            </div>

            <div className="block-for-description">
              <label><b className="label-description-channel">Discription</b></label>
              <input 
              placeholder="input-description-channel" 
              className="input-description-channel"
              type="text"
              id="discription"
              name="discription"
              value={form.discription}
              onChange={changeHandler} 
              />
            </div>

            <button className="button-create" onClick={addPeopleToChannel}>Create</button>

          </div>
        </>
      )
    } else if (showBlockAddPeople) {
      return (
        <>
          <div className="block-create-channel">

            <div>
              <span className="title-create-channel">Add people</span>
              <p className="discription-of-create-channel">
                #example
              </p>
              <label><b className="label-name-channel">People</b></label>
              <input 
              placeholder="input-name-channel" 
              className="input-name-channel"
              type="text"
              id="people"
              name="people"
              value={form.people}
              onChange={changeHandler} 
              />
            </div>
            <button className="button-create" onClick={doneCreateChannel}>Done</button>

          </div>
        </>
      )
    } else {
      return true
    }
  }

  return (
    <div className="right-block">
      <div className="nick-people">
        <b className="main-font sets-peoples-of-chat">Channel browser</b>
        <button className="button-create-channel" onClick={openCloseBlockCreateChannel}>Create channel</button>
        {createChannel()}
        <input type="text" className="input-for-search-channel" ref={inputRef} placeholder="Search by channel name or description"/>
      </div>
    </div>
  )
}