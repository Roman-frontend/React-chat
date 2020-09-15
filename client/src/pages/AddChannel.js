import React from 'react'
import {MessagesContext} from '../context/MessagesContext.js'
import Header from '../components/Header.jsx'
import Profile from '../components/Profile.jsx'
import SetUser from '../components/SetUser.jsx'
import {ChoiceChannel} from '../components/ChoiceChannel.jsx'

export function AddChannel() {

  return (
    <div className="chat-page">
      <Header/>
      <div className="left-block">
        <Profile/>
        <SetUser/>
      </div>
      <MessagesContext component={<ChoiceChannel />} />
    </div>
  )
}