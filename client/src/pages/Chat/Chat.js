import React from 'react'
import Header from '../../components/Header/Header.jsx'
import Profile from '../../components/Profile/Profile.jsx'
import {SetsUser} from '../../components/SetsUser/SetsUser.jsx'
import Conversation from '../../components/Conversation/Conversation.jsx'
import './chat-page.sass'

export const Chat = () => {

	return (
    <div className="chat-page">
      <Header/>
      <div className="left-block">
        <Profile/>
        <SetsUser />
      </div>
      <Conversation />
    </div>
	)
}