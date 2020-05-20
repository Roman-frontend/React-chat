import React from 'react'
import '../css/OpinShareCSS.css'
import iconPeople from '../images/icon-people.png'
import Message from './Message'

export default class Messages extends React.Component {
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
    this.state = {
      messages : [
        {username: 'Yulia', text: "Hi bro i'm glad to see you in my house", createdAt: '18:00 12.05.2020'},
        {username: 'Yulia', text: "Hi bro i'm glad to see you in my house", createdAt: '18:00 12.05.2020'},
      ]
    }
  }

  editDate(date) {
  if (date < 10) { return `0${date}`}
  else { return date}
  }

  handleClick(sliceMessages) {
    const sli = sliceMessages.slice(0, sliceMessages.length);
    const newDate = new Date();
    const date = `${this.editDate(newDate.getHours())}:${this.editDate(newDate.getMinutes())}
      ${newDate.getDate()}.${newDate.getMonth()}.${newDate.getFullYear()}`; 
    sli.unshift({username: 'Yulia', text: this.inputRef.current.value, createdAt: date},)
    this.setState({messages : sli});
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
            <input type="text" className="input-message"
              ref={this.inputRef}/>
            <button className="button"
              onClick={sliceMessages => this.handleClick(this.state.messages)}>hi
            </button>
          </div>
        </div>
      </div>
    )
  }
}