import React from 'react'
import '../css/OpinShareCSS.css'
import Search from './Search'
import Profile from './Profile'
import Messages from './Messages'
import SetUser from './SetUser'
import Message from './Message'

export default function OpinShare() {
	return (
    <div className="class-page">
      <Search/>
      <div className="left-block">
        <Profile/>
        <SetUser/>
      </div>
      <Messages/>
    </div>
	);
}
