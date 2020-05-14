import React from 'react'
import '../CSS/OpinShareCSS.css'
import iconHistori from '../Images/iconHistori.PNG'
import serch from '../Images/serch.png'
import Help from '../Images/Help.png'

export default class Search extends React.Component {

  render () {
    return (
      <div className="input-searcher">
        <img src={iconHistori} className="clock"/>
        <input type="text" name="users" className="input-name-user" />
        <img src={serch} className="icon-serch"/>
        <img src={Help} className="help"/>
      </div>

    )
  }
}