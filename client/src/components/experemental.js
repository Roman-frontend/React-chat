class OpinShare extends React.Component {
  render() {
    return (
      <div>
        <Messages/>
      </div>
    );
  }
}

class Messages extends React.Component {
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
    this.state = {
      messages : [
        {username: 'Yulia', text: "Hi bro i'm glad to see you in my house",
         createdAt: '18:00 12.05.2020'},
        {username: 'Yulia', text: "Hi bro i'm glad to see you in my house",
         createdAt: '18:00 12.05.2020'},
      ]
    }
  }
  
  editDate(date) {
    if (date < 10) { return `0${date}`}
    else { return date}
  }

  handleClick(sliceMessages) {
    const sli = sliceMessages.slice(0, sliceMessages.length)
    console.log(sli);
    const newDate = new Date();
    sli.unshift({username: 'Yulia', text: "Hi bro i'm glad to see you in my house", createdAt: 1},)
    this.setState({messages : sli});
    console.log(sli)
  }

  render () {
    return(
      <div>
        <div className="chat-with-people">
          <Message
            messages={this.state.messages}/>
          <div className="fild-for-message">
            <input type="text" className="input-message"
              ref={this.inputRef}/>
            <button className="button" onClick={sliceMessages => 
          this.handleClick(this.state.messages)}>hi</button>
          </div>
        </div>
      </div>
    )
  }
}

class Message extends React.Component {
  render () {
    const mes = this.props.messages.map((i, index) => 
      <div className="container" key={index}>
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

ReactDOM.render(<OpinShare />, document.getElementById("root"));