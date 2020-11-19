import React from 'react'
import {useSelector} from 'react-redux'
import {useHistory} from 'react-router-dom'
import {useAuth} from '../../hooks/auth.hook.js'
import './profile.sass'

export default function Profile() {
  const history = useHistory()
  const { logout  } = useAuth()
  const authData = useSelector(state => state.login)

  const logoutHandler = event => {
    event.preventDefault()
    logout()
    history.push('/')
  }

  return (
    <div className="profile">
      <p className="main-font profile__name">{"My"}</p>
      <p className="main-font profile__log-out" onClick={logoutHandler} >Log out</p>
    </div>
  )
}