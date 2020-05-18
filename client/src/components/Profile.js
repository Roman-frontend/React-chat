import React from 'react'
import '../css/OpinShareCSS.css'
import edit from '../images/edit.png';

export default class Profile extends React.Component {
  render () {
    return (
      <div className="user-info">
      	<b className="main-font user-name">Roman</b>
		<p className="main-font secondary-font">LRomanV</p>
        <img src={edit} className="main-font edit"/>
      </div>
    )
  }
}