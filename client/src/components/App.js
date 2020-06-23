import React from 'react'
import Search from './Search'
import Profile from './Profile'
import Messages from './Messages'
import SetUser from './SetUser'

export default function App() {
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
