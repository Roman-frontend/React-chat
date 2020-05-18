import React from 'react'
import '../css/OpinShareCSS.css'
import iconPeople from '../images/icon-people.png'
import Message from './Message'

export default class Messages extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      messages : [
        {username: 'Yulia', text: 'Hi bro', createdAt: '18:00 12.05.2020'},
        {username: 'Yulia', text: 'Hi bro', createdAt: '18:00 12.05.2020'},
        {username: 'Yulia', text: 'Hi bro', createdAt: '18:00 12.05.2020'},
      ]
    }
  }
  render () {
    return(
      <div>
        <div className="nick-people">
          <b className="main-font sets-peoples-of-chat"> ✩ Yulia</b>
        </div>
        <div className="chat-with-people">
          <Message
            messages={this.state.messages}/>
          <div className="fild-for-message">
            <input type="text" className="input-message"/>
          </div>
        </div>
      </div>
    )
  }
}