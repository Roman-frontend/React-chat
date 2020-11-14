import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import Modal from 'react-modal'
import {AddPeopleToChannel} from '../AddPeopleToChannel/AddPeopleToChannel.jsx'
Modal.setAppElement('#root')

export function ChannelMembers(props) {
  const { listMembersIsOpen, isNotMembers } = props
  const [modalAddPeopleIsOpen, setModalAddPeopleIsOpen] = useState(false);


  return(
		<div className="user-sets__users" style={{display: listMembersIsOpen ? "block" : "none"}}>
      <div className="user-sets__people"><Link className="main-font" to={`/chat`}>- Yulia</Link></div>
      <div className="user-sets__people">
        <p onClick={() => setModalAddPeopleIsOpen(true)}>+ Invite people</p>
      </div>
      <Modal 
        isOpen={modalAddPeopleIsOpen}
        onRequestClose={() => setModalAddPeopleIsOpen(false)}
        className={"modal-content"}
        overlayClassName={"modal-overlay"}
      >
        <AddPeopleToChannel 
          isNotMembers={isNotMembers}
          setModalAddPeopleIsOpen={setModalAddPeopleIsOpen} 
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























//НЕ ВИДАЛЯТИ ПОКИЩО створює список учасників активного каналу
/*  const createListMembers = useCallback(() => {
    return channelMembers.map( member => {
      return (
        <div key={member._id} id={member._id} className="user-sets__people">
          <Link className="main-font" to={`/chat`}>{member.name}</Link>
        </div>
      )
    })
  }, [channelMembers])*/