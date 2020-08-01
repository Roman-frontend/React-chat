import React from 'react'
import {Link} from 'react-router-dom'
import {AuthContext} from '../context/AuthContext'
import Search from '../components/Search'
import Profile from '../components/Profile'
import SetUser from '../components/SetUser'
import {ChoiceChannel} from '../components/ChoiceChannel'

export function AddChannel() {

  return (
    <div className="class-page">
        <Search/>
        <div className="left-block">
          <Profile/>
          <SetUser/>
        </div>
        <ChoiceChannel />
      </div>
    )
}