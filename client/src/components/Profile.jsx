import React, {useContext} from 'react'
import {NavLink, useHistory} from 'react-router-dom'
import {useAuthContext} from '../context/AuthContext.js'
import edit from '../images/edit.png';

export default function Profile() {
  const history = useHistory()
  const auth = useAuthContext()

  const logoutHandler = event => {
    event.preventDefault()
    auth.logout()
    history.push('/')
  }

  return (
    <div className="user-info">
      <b className="main-font user-info__name">Roman</b>
      <b className="main-font user-info__log-out" onClick={logoutHandler} >Log out</b>
      <img src={edit} className="main-font user-info__edit" alt="edit info of user"/>
    </div>
  )
}