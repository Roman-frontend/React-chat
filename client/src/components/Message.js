import React from 'react'
import '../css/OpinShareCSS.css'
import iconPeople from '../images/icon-people.png'

export default class Message extends React.Component {
  render () {
  	const mes = this.props.messages.map((i, index) => 
      <div className="container">
        <img src={iconPeople} className="icon"/>
        <table className="table">
          <tr><td><p className="messager">{this.props.messages[index].username}</p></td>
          <td><p className="date">18:00 12.05.2020</p></td></tr>
        </table>
        <p className="message">{this.props.messages[index].text}</p>
      </div>
    )
    return (
      mes
    )
  }
}