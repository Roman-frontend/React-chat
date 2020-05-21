import React, {useState} from 'react'
import '../css/OpinShareCSS.css'
import iconPeople from '../images/icon-people.png'

export default function Message(props) {
	const mes = props.messages.map((i, index) => 
    <div className="container">
      <div className="icon"><img src={iconPeople}/></div>
      <div className="messager"><p>{props.messages[index].username}</p></div>
      <div className="date"><p>{props.messages[index].createdAt}</p></div>
      <div className="message"><p>{props.messages[index].text}</p></div>
    </div>
  )
  return (
    mes
  )
}