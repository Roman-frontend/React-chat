import React from 'react'
import {MessagesContext} from '../../context/MessagesContext.js'
import Header from '../../components/Header/Header.jsx'
import Profile from '../../components/Profile/Profile.jsx'
import SetsUser from '../../components/SetsUser/SetsUser.jsx'
import {ChoiceChannel} from '../../components/ChoiceChannel/ChoiceChannel.jsx'

export function AddChannel() {

  return (
    <div className="chat-page">
      <Header/>
      <div className="left-block">
        <Profile/>
        <SetsUser/>
      </div>
      <MessagesContext component={<ChoiceChannel />} />
    </div>
  )
}