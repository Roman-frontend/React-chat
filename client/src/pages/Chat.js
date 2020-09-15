import React from 'react'
import {MessagesContext} from '../context/MessagesContext.js'
import Header from '../components/Header.jsx'
import Profile from '../components/Profile.jsx'
import SetUser from '../components/SetUser.jsx'
import Conversation from '../components/Conversation.jsx'

export const Chat = () => {

	return (
    <div className="chat-page">
      <Header/>
      <div className="left-block">
        <Profile/>
        <SetUser/>
      </div>
      <MessagesContext component={<Conversation />} />       
    </div>
	)
}