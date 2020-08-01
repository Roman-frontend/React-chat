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
        <div className="block-create-channel">
          <label className="label-name">Name</label>
          <input placeholder="Name channel" className="input-name-channel" />
        </div>)
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