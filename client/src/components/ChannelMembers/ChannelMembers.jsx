import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import Modal from 'react-modal'
import {AddPeopleToChannel} from '../AddPeopleToChannel/AddPeopleToChannel.jsx'
Modal.setAppElement('#root')

export function ChannelMembers(props) {
  const { listMembersIsOpen, isNotMembers } = props
  const [modalAddPeopleIsOpen, setModalAddPeopleIsOpen] = useState(false);


  return(
    <div 
      className="user-sets__users" 
      style={{display: listMembersIsOpen ? "block" : "none"}}
    >
      <div className="user-sets__people">
        <Link 
          className="main-font" 
          to={`/chat`}
        >
          - Yulia
        </Link>
      </div>
      <div className="user-sets__people">
        <p onClick={() => setModalAddPeopleIsOpen(true)}>
          + Invite people
        </p>
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
        />
      </Modal>
      <div className="user-sets__people">
        <Link 
          className="main-font" 
          to={`/filterContacts`}
        >
          Filter Contants
        </Link>
      </div>
    </div>
	)
}























//НЕ ВИДАЛЯТИ ПОКИЩО створює список учасників активного каналу
/*  
  import {useSelector} from 'react-redux'
  const allChannels = useSelector(state => state.channels)
  const activeChannelId = useSelector(state => state.activeChannelId)

  const activeChannel = useMemo(() => {
    if (activeChannelId && allChannels) {
      return allChannels.filter(channel => channel._id === activeChannelId)
    }
  }, [activeChannelId, allChannels]) 
  const createListMembers = useCallback(() => {
    return activeChannel[0].members.map( member => {
      return (
        <div key={member._id} id={member._id} className="user-sets__people">
          <Link className="main-font" to={`/chat`}>{member.name}</Link>
        </div>
      )
    })
  }, [activeChannel])*/