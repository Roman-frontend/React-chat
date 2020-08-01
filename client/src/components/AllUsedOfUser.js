import React from 'react'
import {Link} from 'react-router-dom'

export default function AllUsedOfUser(props) {
/*
  function toGeneralChannel() {
    <Link to={`/CreateChannel`}>Create channel</Link>
  }*/

  return (
    <div className="instruments">
      <p className="main-font text-chanels">
      &#x25BC; Channels</p>
      <b className="main-font plus first-plus">+</b>
      <Link className="main-font different-channels" to={`/addChannel`} >Add channel</Link>
      <Link className="main-font different-channels" to={`/chat`} >#general</Link>
      <p className="main-font direct-messages">&#x25BC; Direct messages</p>
      <b className="main-font plus two-plus">+</b>
      <p className="main-font different-messages">- Yulia</p>
      <p className="main-font invite-people">+ Invite people</p>
    </div>
  )
}