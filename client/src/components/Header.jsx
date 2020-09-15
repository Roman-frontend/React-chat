import React from 'react'
import iconHistori from '../images/iconHistori.png'
import serch from '../images/serch.png'
import Help from '../images/Help.png'

export default function Header() {
  return (
    <div className="header">
      <img src={iconHistori} className="header-element__clock" alt="clock"/>
      <input type="text" name="users" className="header-element__field-for-search" />
      <img src={serch} className="header-element__icon-search" alt="icon for search"/>
      <img src={Help} className="header-element__help" alt="helper"/>
    </div>
  )
}