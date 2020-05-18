import React from 'react'
import './OpinShareCSS.css'
import Search from './Search'
import Profile from './Profile'
import FieldMessage from './FieldMessage'
import SetUser from './SetUser'

export default class OpinShare extends React.Component {

  render() {

	return (
		<div>
		    <div className="style-fixed-div">
		    	<Search/>
		    	<Profile/>
		    </div>
		    <div>
		    	<SetUser/>
		    </div>
		    <div>
		    	<FieldMessage/>
		    </div>

		</div>
	);
  }
}
