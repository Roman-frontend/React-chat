import React, {useState} from 'react'
import '../css/OpinShareCSS.css'
import iconPeople from '../images/icon-people.png'

export default function Message(props) {
  return (
    <div className="container">
      <div className="icon"><img src={iconPeople}/></div>
      <div className="messager"><p>{props.message.username}</p></div>
      <div className="date"><p>{props.message.createdAt}</p></div>
      <div className="message"><p>{props.message.text}</p></div>
    </div>
    )
}