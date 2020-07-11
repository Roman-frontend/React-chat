import React, {useContext} from 'react'
import {NavLink, useHistory} from 'react-router-dom'
import {AuthContext} from '../context/AuthContext'
import edit from '../images/edit.png';

export default function Profile() {
  const history = useHistory()
  const auth = useContext(AuthContext)

  const logoutHandler = event => {
    event.preventDefault()
    auth.logout()
    history.push('/')
  }

  return (
    <div className="user-info">
      <b className="main-font user-name">Roman</b>
      <b className="main-font log-out" onClick={logoutHandler} >Log out</b>
      <p className="main-font secondary-font">LRomanV</p>
      <img src={edit} className="main-font edit" alt="edit info of user"/>
    </div>
  )
}