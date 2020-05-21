import React from 'react'
import '../css/OpinShareCSS.css'
import contacts from '../images/contacts.png'
import apps from '../images/apps.png'
import files from '../images/files.png'

export default function PeopleAppsFiles() {
  return(
    <div className="state-info">
      <b className="set-info-user">Get user</b>
      <p className="main-font all-done">All done</p>
      <img src={contacts} className="sets-img-get-user icon-contacts"/>
      <p className="main-font people">People</p>
      <img src={apps} className="sets-img-get-user icon-apps"/>
      <p className="main-font apps-get-user">Apps</p>
      <img src={files} className="sets-img-get-user icon-files"/>
      <p className="main-font files">Files</p>
    </div>
  )
}