import React, {useEffect, useRef, useState} from 'react'
import {Link} from 'react-router-dom'
import {AuthContext} from '../context/AuthContext'

export function ChoiceChannel() {
  const inputRef = useRef(null);
  const [showBlockCreateChannel, setShowBlockCreateChannel] = useState(false)

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  function openCloseBlockCreateChannel() {
    setShowBlockCreateChannel(!showBlockCreateChannel)
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
              <input placeholder="input-name-channel" className="input-name-channel" />
            </div>
            <div className="block-for-description">
              <label><b className="label-description-channel">Discription</b></label>
              <input placeholder="input-description-channel" className="input-description-channel" />
            </div>
            <button className="button-create">Create</button>
          </div>
        </>)
    } else {
      return <button className="button-create-channel" onClick={openCloseBlockCreateChannel}>Create channel</button>
    }
  }

  return (
    <div className="right-block">
      <div className="nick-people">
        <b className="main-font sets-peoples-of-chat">Channel browser</b>
        {createChannel()}
        <input type="text" className="input-for-search-channel" ref={inputRef} placeholder="Search by channel name or description"/>
      </div>
    </div>
  )
}