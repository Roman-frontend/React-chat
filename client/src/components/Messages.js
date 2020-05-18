import React from 'react'
import '../css/OpinShareCSS.css'
import iconPeople from '../images/icon-people.png'

export default class FieldMessage extends React.Component {
  render () {
    return(
      <div>
        <div className="nick-people">
          <b className="main-font sets-peoples-of-chat"> ✩ Yulia</b>
        </div>
        <div className="chat-with-people">
          <div className="container container-for-messages">
            <img src={iconPeople} className="icon"/>
            <div><p className="messager">Yulia</p></div>
            <div><p className="time-of-send">18:00 12.05.2020</p></div>
            <div><p className="message-from-people">Hi bro</p></div>
          </div>
          <div className="container container-for-messages">
            <img src={iconPeople} className="icon"/>
            <div><p className="messager">Yulia</p></div>
            <div><p className="time-of-send">18:00 12.05.2020</p></div>
            <div><p className="message-from-people">How are you?</p></div>
          </div>
          <div className="container fild-for-message">
            <input type="text" name="Message #general" className="input-message"/>
          </div>
        </div>
      </div>
    )
  }
}