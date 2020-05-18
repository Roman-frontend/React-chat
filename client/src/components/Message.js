import React from 'react'
import '../css/OpinShareCSS.css'
import iconPeople from '../images/icon-people.png'

export default class Message extends React.Component {
  render () {
    return(
      <div className="container">
        <img src={iconPeople} className="icon"/>
        <table className="table">
          <tr><td><p className="messager">Yulia</p></td>
          <td><p className="date">18:00 12.05.2020</p></td></tr>
        </table>
        <p className="message">Hi bro</p>
      </div>
    )
  }
}