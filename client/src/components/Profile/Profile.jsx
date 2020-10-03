import React from 'react'
import {useHistory} from 'react-router-dom'
import {useAuthContext} from '../../context/AuthContext.js'
import edit from '../../images/edit.png';
import './profile.sass'

export default function Profile() {
  const history = useHistory()
  const { logout, name  } = useAuthContext()

  const logoutHandler = event => {
    event.preventDefault()
    logout()
    history.push('/')
  }

  return (
    <div className="profile">
      <b className="main-font profile__name">{name}</b>
      <b className="main-font profile__log-out" onClick={logoutHandler} >Log out</b>
      <img src={edit} className="main-font profile__edit" alt="edit info of user"/>
    </div>
  )
}