import React from 'react'
import Search from '../components/Search'
import Profile from '../components/Profile'
import Messages from '../components/Messages'
import SetUser from '../components/SetUser'

export const Chat = () => {

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