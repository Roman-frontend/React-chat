import React from 'react'

export default class AllUsedOfUser extends React.Component {
  render() {
    return(
      <div className="instruments">
        <p className="main-font text-chanels">
        &#x25BC; Channels</p>
        <b className="main-font plus first-plus">+</b>
        <p className="main-font different-channels">#general</p>
        <p className="main-font add-channel">+ Add a channel</p>
        <p className="main-font direct-messages">&#x25BC; Direct messages</p>
        <b className="main-font plus two-plus">+</b>
        <p className="main-font different-messages">- Yulia</p>
        <p className="main-font invite-people">+ Invite people</p>
      </div>
    )
  }
}