import React from 'react'
import '../CSS/OpinShareCSS.css'
import edit from '../Images/edit.png';

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
