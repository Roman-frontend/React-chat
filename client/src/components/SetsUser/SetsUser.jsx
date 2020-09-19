import React, {useState, useEffect, useCallback} from 'react'
import {Link} from 'react-router-dom'
import Modal from 'react-modal'
import {useAuthContext} from '../../context/AuthContext.js'
import {useServer} from '../../hooks/Server.js'
import {AddChannel} from '../AddChannel/AddChannel.jsx'
import './user-sets.sass'

Modal.setAppElement('#root')

export default function SetsUser(props) {
  const {userId} = useAuthContext();
  const {getData} = useServer()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [channels, setChannels] = useState([])

  useEffect(() => {
    async function getChannels() {
      const response = await getData(`/api/channel/get-messages${userId}`)
      setChannels(response)
    }

    getChannels()
  }, [])

  const setListChannels = useCallback(() => {
    if (channels) {
      const nameChannels = channels.map(channel => {return channel.name})
      return ( nameChannels.map((name, index) => {
        return <div key={name}><Link className="main-font" to={`/chat`}>{name}</Link></div>})
      )
    }
  }, [channels])

  return (
    <div className="main-font">
      <div className="channels">
        <p className="user-sets__text-chanels">&#x25BC; Channels</p>
        <b className="plus plus__first-plus">+</b>
      </div>
      <div className="user-sets__different-channels">
        <div><p className="main-font" onClick={() => setModalIsOpen(true)}>Add channel</p></div>
        <Modal 
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          ariaHideApp={false}
          className={"modal__content"}
          overlayClassName={"modal__overlay"}
        >
          <AddChannel setModalIsOpen={setModalIsOpen}/>
        </Modal>
        <div><Link className="main-font" to={`/chat`} >#general</Link></div>
        {setListChannels()}
      </div>
      <div className="direct-messages">
        <p className="user-sets__direct-messages">&#x25BC; Direct messages</p>
        <b className="plus plus__second-plus">+</b>
      </div>
      <div className="user-sets__users">
        <div><Link className="main-font" to={`/chat`}>- Yulia</Link></div>
        <div><Link className="main-font" to={`/chat`}>+ Invite people</Link></div>
        <div><Link className="main-font" to={`/filterContacts`}>Filter Contants</Link></div>
      </div>
    </div>
  )
}