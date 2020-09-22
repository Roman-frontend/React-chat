import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import Modal from 'react-modal'
import {useAuthContext} from '../../context/AuthContext.js'
import {useMessagesContext} from '../../context/MessagesContext.js'
import {useServer} from '../../hooks/Server.js'
import {AddChannel} from '../AddChannel/AddChannel.jsx'
import {AddPeopleToChannel} from '../AddPeopleToChannel/AddPeopleToChannel.jsx'
import './user-sets.sass'
Modal.setAppElement('#root')

export default function SetsUser(props) {
  const {userId} = useAuthContext();
  const {activeChannelId, setActiveChannelId} = useMessagesContext();
  const {getUsers, getChannels, getMessages} = useServer();
  const [modalAddChannelIsOpen, setModalAddChannelIsOpen] = useState(false);
  const [modalAddPeopleIsOpen, setModalAddPeopleIsOpen] = useState(false);
  const [listChannels, setListChannels] = useState(null);
  const [activeChannelName, setActiveChannelName] = useState("general")

  useEffect(() => {
    async function getData() {
      const serverUsers = await getUsers(`/api/channel/get-users${userId}`)
      const serverChunnels = await getChannels(`/api/channel/get-chunnels${userId}`)
      //console.log(response.usersNames, response.userChannels[0]._id)
      if (serverChunnels) createListChannels(serverChunnels.userChannels)
    }

    getData()
  }, [])

  function createListChannels(channels) {
    const dataBaseChannels = channels.map(channel => { return {name: channel.name, _id: channel._id} })
    const linksChannels = createLinksChannels(dataBaseChannels)
    setListChannels(linksChannels)
  }

  function createLinksChannels(dataBaseChannels) {
    let allChannels = [
      <div 
        key='1' 
        id='1'
        className="user-sets__channel user-sets__channel_active" 
        onClick={(idActive, nameActive) => toActiveChannel(1, "general")}
      >
        <Link className="main-font" to={`/chat`} >&#128274;general</Link>
      </div>
    ]

    if (dataBaseChannels) dataBaseChannels.map(channel => { allChannels.push(createLinkChannel(channel)) } )
    return allChannels
  }

  function createLinkChannel(channel) {
    return (
      <div 
        key={channel._id} 
        id={channel._id}
        className="user-sets__channel" 
        onClick={(idActive, nameActive) => toActiveChannel(channel._id, `#${channel.name}`)}
      >
        <Link className="main-font" to={`/chat`}>{`#${channel.name}`}</Link>
      </div>
    )
  }

  async function toActiveChannel(idActive, nameActive) {
    document.querySelector('.user-sets__channel_active').classList.remove('user-sets__channel_active')
    document.getElementById(idActive).classList.add('user-sets__channel_active')
    await getMessages(`/api/chat/get-messages${idActive}`)
    setActiveChannelName(nameActive)
    setActiveChannelId(idActive)
  }

  return (
    <div className="main-font user-sets">
      <div className="user-sets__nav-channels">
        <p className="user-sets__nav-channels-name">&#x25BC; Channels</p>
        <b className="plus user-sets__nav-channels-plus">+</b>
      </div>
      <div className="user-sets__different-channels">
        <div className="user-sets__channel"><p className="main-font" onClick={() => setModalAddChannelIsOpen(true)}>Add channel</p></div>
        <Modal 
          isOpen={modalAddChannelIsOpen}
          onRequestClose={() => setModalAddChannelIsOpen(false)}
          className={"modal-content"}
          overlayClassName={"modal-overlay"}
        >
          <AddChannel 
            setModalAddChannelIsOpen={setModalAddChannelIsOpen} 
            setListChannels={setListChannels}
            createLinkChannel={createLinkChannel}
          />
        </Modal>
        {listChannels}
      </div>
      <div className="user-sets__nav-messages">
        <p className="user-sets__nav-messages-name">&#x25BC; Direct messages</p>
        <b className="plus user-sets__nav-messages-plus">+</b>
      </div>
      <div className="user-sets__users">
        <div className="user-sets__people"><Link className="main-font" to={`/chat`}>- Yulia</Link></div>
        <div className="user-sets__people">
          <Link className="main-font" onClick={() => setModalAddPeopleIsOpen(true)} to={`/chat`}>+ Invite people</Link>
        </div>
        <Modal 
          isOpen={modalAddPeopleIsOpen}
          onRequestClose={() => setModalAddPeopleIsOpen(false)}
          className={"modal-content"}
          overlayClassName={"modal-overlay"}
        >
          <AddPeopleToChannel 
            setModalAddPeopleIsOpen={setModalAddPeopleIsOpen} 
            activeChannelName={activeChannelName} 
          />
        </Modal>
        <div className="user-sets__people"><Link className="main-font" to={`/filterContacts`}>Filter Contants</Link></div>
      </div>
    </div>
  )
}