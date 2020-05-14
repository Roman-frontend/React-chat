import React from 'react'
import './OpinShareCSS.css'
import iconPeople from './icon-people.png'

export default class FieldMessage extends React.Component {
	render () {
		return(
			<div>
				<div className="nick-people">
			      <b className="set-text-get-user sets-peoples-of-chat"> ✩ Yulia</b>
			    </div>
			    <div className="chat-with-people">
			      <div className="conteiner conteiner-for-1-message">
			        <img src={iconPeople} className="icon"/>
			        <p className="messager placing-nick-people-1">Yulia</p>
			        <p className="time-of-send">18:00 12.05.2020</p>
			        <p className="message-from-people">Hi bro</p>
			      </div>
			      <div className="conteiner conteiner-for-2-message">
			        <img src={iconPeople} className="icon"/>
			        <p className="messager placing-nick-people-2">Yulia</p>
			        <p class="time-of-send">18:00 12.05.2020</p>
			        <p className="message-from-people">How are you</p>
			      </div>
			      <div className="fild-for-message">
			        <input type="text" name="Message #general" className="input-message"/>
			      </div>
			    </div>
			</div>
		)
	}
}