import React from 'react'
import '../CSS/OpinShareCSS.css'

export default class AllUsedOfUser extends React.Component {
  render() {
    return(
      <div className="instruments">
        <p className="set-text-get-user text-chanels">
        &#x25BC; Channels</p>
        <b className="set-text-get-user plus first-plus">+</b>
        <p className="set-text-get-user different-channels">#general</p>
        <p className="set-text-get-user add-channel">+ Add a channel</p>
        <p className="set-text-get-user direct-messages">&#x25BC; Direct messages</p>
        <b className="set-text-get-user plus two-plus">+</b>
        <p className="set-text-get-user different-messages">- Yulia</p>
        <p className="set-text-get-user invite-people">+ Invite people</p>
        <p className="set-text-get-user apps">&#x25BC; Apps</p>
        <b className="set-text-get-user plus three-plus">+</b>
      </div>
    )
  }
}