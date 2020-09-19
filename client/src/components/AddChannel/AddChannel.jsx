import React, {useEffect, useRef, useState} from 'react'
import {useAuthContext} from '../../context/AuthContext.js'
import {useServer} from '../../hooks/Server.js'
import './add-channel.sass'

export function AddChannel(props) {
  const {userId} = useAuthContext();
  const {postData} = useServer()
  const inputRef = useRef(null);
  const [form, setForm] = useState({})

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const changeHandler = event => {
    setForm({ ...form, [event.target.name]: event.target.value, userId })
  }

  const doneCreate = () => {
    console.log(form)
    props.setModalIsOpen(false)
    postData('/api/channel/post-channel', form)
  }

  return (
    <div className="new-channel">
      <label className="new-channel__choice">Channel browser</label>
      <input 
        type="text" 
        className="new-channel__search" 
        ref={inputRef} 
        placeholder="Search by channel name or description"
      />
      <div className="block-create-channel">

        <label className="new-channel__create">Create a channel</label>
        <p className="new-channel__discription-create">
          Channels are where your team communicates. They’re best when organized around a topic — #marketing, for example.
        </p>

        <div className="new-channel__forms">
          <div>
            <label className="label-name">Name</label>
            <input 
              placeholder="input-name-channel" 
              className="input-name"
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={changeHandler} 
            />
          </div>

          <div>
            <label className="label-description">Discription</label>
            <input 
              placeholder="input-description-channel" 
              className="input-description"
              type="text"
              id="discription"
              name="discription"
              value={form.discription}
              onChange={changeHandler} 
            />
          </div>
        </div>

        <button className="button-create" onClick={doneCreate}>Create</button>
      </div>
    </div>
  )
}