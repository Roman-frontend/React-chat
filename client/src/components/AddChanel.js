import React, {useState, useContext} from 'react'
import {AuthContext} from '../context/AuthContext'

export default function AllUsedOfUser(props) {

  const [showCreateChannel, setShowCreateChannel] = useState(false)
  const {usersNames} = useContext(AuthContext)

  console.log(usersNames)
  const all = () => {
  	setShowCreateChannel(!showCreateChannel)
  }

  const o = () => {
  	
  }

  const createChannel = () => {
  	if (showCreateChannel) {
      return (
      	<>
      	  <div className="main-font add-channel">
      	  	<div>
      	      <p onClick={all}>+ Add a channel</p>
      	    </div>
      	  </div>
	      <div className="create-channel" onClick={o}>
		    <p className="main-font"
		      >Create channel</p>
		  </div>
		</>
	  )
    } else {
       return (
       	  <div className="main-font add-channel" onClick={all}>
  	        <p>
            + Add a channel
            </p>
          </div>
        )
    }
  }

  return (
  	createChannel()
  )
}