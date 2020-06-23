import React from 'react'
import iconHistori from '../images/iconHistori.PNG'
import serch from '../images/serch.png'
import Help from '../images/Help.png'

export default function Search() {
  return (
    <div className="search">
      <img src={iconHistori} className="set-search clock" alt="clock"/>
      <input type="text" name="users" className="set-search field-for-search" />
      <img src={serch} className="set-search icon-serch" alt="icon for search"/>
      <img src={Help} className="set-search help" alt="helper"/>
    </div>
  )
}