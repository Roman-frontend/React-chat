import React from 'react'
import './OpinShareCSS.css'
import edit from './edit.png';

export default class Profile extends React.Component {
	render () {
		return (
			<div className="user-info">
      			<b className="name-user">Roman</b>
      			<p className="info-user">LRomanV</p>
      			<img src={edit} className="edit"/>
    		</div>
		)
	}
}