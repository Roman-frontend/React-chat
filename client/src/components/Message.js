import React from 'react'
import '../css/OpinShareCSS.css'
import iconPeople from '../images/icon-people.png'

export default class Message extends React.Component {
  render () {
  	const mes = this.props.messages.map((i, index) => 
      <div className="container">
        <div className="icon"><img src={iconPeople}/></div>
        <div className="messager"><p>{this.props.messages[index].username}</p></div>
        <div className="date"><p>{this.props.messages[index].createdAt}</p></div>
        <div className="message"><p>{this.props.messages[index].text}</p></div>
      </div>
    )
    return (
      mes
    )
  }
}