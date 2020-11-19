import React, {useState, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux'
import {connect} from 'react-redux'
import {postData} from '../../redux/actions/actions.js'
import {POST_ADD_PEOPLES_TO_CHANNEL} from '../../redux/types.js'
import {SelectPeople} from '../SelectPeople/SelectPeople.jsx'
import './add-people-to-channel.sass';


export function AddPeopleToChannel(props) {
  const dispatch = useDispatch()
  const token = useSelector(state => state.token)
  const activeChannelId = useSelector(state => state.activeChannelId)
  const channels = useSelector(state => state.channels)
  const { isNotMembers, setModalAddPeopleIsOpen } = props
  const [invited, setInvited] = useState([])
  const parrentDivRef = useRef()
  const buttonCloseRef = useRef()
  const buttonDoneRef = useRef()
  const heightParrentDiv = 'set-channel__invite_height'

  function createMainLabel() {
    const activeChannel = channels.filter(channel => channel._id === activeChannelId)
    return !activeChannel[0] ? (
      <p className="set-channel-forms__main-label-text">
    		Invite people to #general
      </p>
    ) : activeChannel[0].name.match(/^#/) ? (
    	<p className="set-channel-forms__main-label-text">
    		Invite people to {`${activeChannel[0].name}`}
    	</p>
    ) : (
    	<p className="set-channel-forms__main-label-text">
    		Invite people to &#128274;{activeChannel[0].name}
    	</p>
    );
  }

  async function doneInvite(action) {
    if (action === "invite") {
      await dispatch( 
        postData(POST_ADD_PEOPLES_TO_CHANNEL, token, invited, activeChannelId) 
      )
    }
    //console.log(invited, notInvited)
    setInvited([])
    setModalAddPeopleIsOpen(false)
  }


	return (
    <div 
      className="set-channel"
      ref={parrentDivRef}
    >
      <label>{createMainLabel()}</label>
      <SelectPeople 
        isNotMembers={isNotMembers}
        invited={invited}
        setInvited={setInvited}
        parrentDivRef={parrentDivRef}
        buttonCloseRef={buttonCloseRef}
        buttonDoneRef={buttonDoneRef}
        heightParrentDiv={heightParrentDiv}
      />

      <button 
        className="set-channel__button" 
        ref={buttonCloseRef}
      	onClick={doneInvite}
      >
      	Close
      </button>

      <button 
      	type="submit"
        className="set-channel__button" 
        ref={buttonDoneRef}
      	onClick={() => doneInvite("invite")}
      >
      	Invite
      </button>
    </div>
  )
}

const mapDispatchToProps = {
  postData 
}

export default connect(null, mapDispatchToProps)(AddPeopleToChannel)