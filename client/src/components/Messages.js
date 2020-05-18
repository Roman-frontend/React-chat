import React from 'react'
import '../css/OpinShareCSS.css'
import iconPeople from '../images/icon-people.png'
import Message from './Message'

export default class Messages extends React.Component {
  render () {
    return(
      <div>
        <div className="nick-people">
          <b className="main-font sets-peoples-of-chat"> ✩ Yulia</b>
        </div>
        <div className="chat-with-people">
          <Message/>
          <div className="container fild-for-message">
            <input type="text" className="input-message"/>
          </div>
        </div>
      </div>
    )
  }
}