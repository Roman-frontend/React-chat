import React from 'react'
import '../css/OpinShareCSS.css'
import Search from './Search'
import Profile from './Profile'
import Messages from './Messages'
import SetUser from './SetUser'
import Message from './Message'

export default function OpinShare() {
	return (
    <div className="style-div">
      <div className="style-fixed-div">
        <Search/>
        <Profile/>
      </div>
      <div className="left-block">
        <SetUser/>
      </div>
      <div className="right-block">
        <Messages/>
      </div>

    </div>
	);
}
