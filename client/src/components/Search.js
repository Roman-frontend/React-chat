import React from 'react'
import '../css/OpinShareCSS.css'
import iconHistori from '../images/iconHistori.PNG'
import serch from '../images/serch.png'
import Help from '../images/Help.png'

export default function Search() {
  return (
    <div className="search">
      <img src={iconHistori} className="set-search clock"/>
      <input type="text" name="users" className="set-search fild-for-search" />
      <img src={serch} className="set-search icon-serch"/>
      <img src={Help} className="set-search help"/>
    </div>
  )
}