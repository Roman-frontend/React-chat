import React from 'react'
import './OpinShareCSS.css'
import iconHistori from './iconHistori.PNG'
import serch from './serch.png'
import Help from './Help.png'

export default class Search extends React.Component {

	render () {
		return (
			<div className="input-searcher">
      			<img src={iconHistori} className="clock"/>
      			<input type="text" name="users" className="input-name-user" />
      			<img src={serch} className="icon-serch"/>
      			<img src={Help} className="help"/>
    		</div>

		)
	}
}