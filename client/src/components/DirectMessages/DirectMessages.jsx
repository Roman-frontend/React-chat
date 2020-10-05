import React, {useState, useCallback} from 'react'
import {Link} from 'react-router-dom'
import Modal from 'react-modal'
import {AddPeopleToChannel} from '../AddPeopleToChannel/AddPeopleToChannel.jsx'
Modal.setAppElement('#root')

export function DirectMessages(props) {
  const { channelMembers } = props

  const [modalAddPeopleIsOpen, setModalAddPeopleIsOpen] = useState(false);

  const createListMembers = useCallback(() => {
    return channelMembers.map( member => {
      return (
        <div key={member._id} id={member._id} className="user-sets__people">
          <Link className="main-font" to={`/chat`}>{member.name}</Link>
        </div>
      )
    })
  }, [channelMembers])


  return(
		<div className="user-sets__users">
      <div className="user-sets__people"><Link className="main-font" to={`/chat`}>- Yulia</Link></div>
      {createListMembers()}
      <div className="user-sets__people">
        <Link 
          className="main-font" 
          onClick={() => setModalAddPeopleIsOpen(true)} 
          to={`/chat`}
        >
          + Invite people
        </Link>
      </div>
      <Modal 
        isOpen={modalAddPeopleIsOpen}
        onRequestClose={() => setModalAddPeopleIsOpen(false)}
        className={"modal-content"}
        overlayClassName={"modal-overlay"}
      >
        <AddPeopleToChannel 
          setModalAddPeopleIsOpen={setModalAddPeopleIsOpen} 
          channelName={props.channelName} 
          notParticipantsChannel={props.notParticipantsChannel}
          setNotParticipantsChannel={props.setNotParticipantsChannel}
          invited={props.invited}
          setInvited={props.setInvited}
          setChannelMembers={props.setChannelMembers}
        />
      </Modal>
      <div className="user-sets__people">
        <Link className="main-font" to={`/filterContacts`}>Filter Contants</Link>
      </div>
    </div>
	)
}