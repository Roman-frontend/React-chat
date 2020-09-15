import React from 'react'
import {Link} from 'react-router-dom'

export default function AllUsedOfUser(props) {

  return (
    <div className="user-sets main-font">
      <p className="user-sets__text-chanels">
      &#x25BC; Channels</p>
      <b className="plus plus__first-plus">+</b>
      <div className="user-sets__different-channels">
        <Link className="main-font" to={`/addChannel`} >Add channel</Link>
        <Link className="main-font" to={`/chat`} >#general</Link>
      </div>
      <p className="user-sets__direct-messages">&#x25BC; Direct messages</p>
      <b className="plus plus__second-plus">+</b>
      <div className="user-sets__users">
        <p className="main-font">- Yulia</p>
        <p className="main-font">+ Invite people</p>
        <Link className="main-font" to={`/filterContacts`} >Filter Contants</Link>
      </div>
    </div>
  )
}