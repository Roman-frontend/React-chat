import React, {useState, useEffect, useCallback} from 'react'
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
  const {userId, userData} = useAuthContext();
  const {activeChannelId, setActiveChannelId} = useMessagesContext();
  const {getUsers, getChannels, getMessages} = useServer();

  const [modalAddChannelIsOpen, setModalAddChannelIsOpen] = useState(false);
  const [modalAddPeopleIsOpen, setModalAddPeopleIsOpen] = useState(false);
  const [listChannels, setListChannels] = useState([]);
  const [notParticipantsChannel, setNotParticipantsChannel] = useState(null)
  const [channelMembers, setChannelMembers] = useState([])
  const [isNotMembersChannel, setIsNotMembersChannel] = useState([])
  const [dataChannels, setDataChannels] = useState(null)
  const [channelName, setChannelName] = useState("general")

  useEffect(() => {
    async function createListChannels() {
      const serverChunnels = await getChannels(`/api/channel/post-chunnels`, userData.channels )
      if (serverChunnels) { 
        createChannels(serverChunnels.userChannels)
        setDataChannels(serverChunnels.userChannels)
      }
    }

    if (userData) createListChannels()
  }, [userData])

  useEffect(() => {
    async function getPeoples() {
      const serverUsers = await getUsers(`/api/channel/get-users${userId}`)

      if (serverUsers) {
        const otherUsers = serverUsers.users.filter(people => people._id !== userId)
        setIsNotMembersChannel(otherUsers)
      }
    }

    getPeoples()
  }, [])

  function createChannels(channels) {
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
    getListMembersAndNot(idActive)

    setChannelName(nameActive)
    setActiveChannelId(idActive)
  }

  function getListMembersAndNot(idActive) {
    let chunnels
    setDataChannels(serverChannels => {
      chunnels = serverChannels
      return serverChannels
    })
    console.log(chunnels)
    chunnels.map(channel => {
      if (channel._id === idActive) {
        let isNotMembers
        setIsNotMembersChannel(peoplesId => { 
          isNotMembers = peoplesId
          return peoplesId
        })
        channel.members.forEach(member => {
          isNotMembers = isNotMembers.filter(people => people._id !== member) 
        })
        setChannelMembers(channel.members)
        setNotParticipantsChannel(isNotMembers)
      }
    })
  }

  function createListMembers() {
    if (isNotMembersChannel && channelMembers[0]) {
      return isNotMembersChannel.map(member => {
        for (const memberId of channelMembers) {
          if (member._id === memberId) {
            return (
              <div key={member._id} id={member._id} className="user-sets__people">
                <Link className="main-font" to={`/chat`}>{member.name}</Link>
              </div>
            )
          } 
        }
      })
    }
  }


  return (
    <div className="main-font user-sets">
      <div className="user-sets__nav-channels">
        <p className="user-sets__nav-channels-name">&#x25BC; Channels</p>
        <b className="plus user-sets__nav-channels-plus">+</b>
      </div>
      <div className="user-sets__different-channels">
        <div className="user-sets__channel">
          <p className="main-font" 
            onClick={() => setModalAddChannelIsOpen(true)}
          >
            Add channel
          </p>
        </div>
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
            channelName={channelName} 
            notParticipantsChannel={notParticipantsChannel}
            setNotParticipantsChannel={setNotParticipantsChannel}
            channelMembers={channelMembers}
          />
        </Modal>
        <div className="user-sets__people">
          <Link className="main-font" to={`/filterContacts`}>Filter Contants</Link>
        </div>
      </div>
    </div>
  )
}