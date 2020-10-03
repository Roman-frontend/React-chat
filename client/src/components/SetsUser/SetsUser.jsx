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
  const {changeLocalStorageUserData, userId, userData, setUserData} = useAuthContext();
  const {activeChannelId, setActiveChannelId} = useMessagesContext();
  const {getUsers, getChannels, getMessages} = useServer();

  const [modalAddChannelIsOpen, setModalAddChannelIsOpen] = useState(false);
  const [modalAddPeopleIsOpen, setModalAddPeopleIsOpen] = useState(false);
  const [listChannels, setListChannels] = useState([]);
  const [notParticipantsChannel, setNotParticipantsChannel] = useState([])
  const [channelMembers, setChannelMembers] = useState([])
  const [allUsersWithoutActive, setAllUsersWithoutActive] = useState([])
  const [dataChannels, setDataChannels] = useState(null)
  const [invited, setInvited] = useState([])
  const [channelName, setChannelName] = useState("general")

  useEffect(() => {
    async function createListChannels() {
      console.log(userData)
      const serverChunnels = await getChannels(`/api/channel/post-chunnels`, userData.channels )
      changeLocalStorageUserData(userData)
      const data = JSON.parse(localStorage.getItem('userData'))
      if (serverChunnels) { 
        setDataChannels(serverChunnels.userChannels)
        //console.log(serverChunnels.userChannels)
        const linksChannels = createLinksChannels(serverChunnels.userChannels)
        setListChannels(linksChannels)
      }
    }

    if (userData) createListChannels()
  }, [userData])

  useEffect(() => {
    async function getPeoples() {
      const serverUsers = await getUsers(`/api/channel/get-users${userId}`)

      if (serverUsers) {
        const otherUsers = serverUsers.users.filter(people => people._id !== userId)
        setAllUsersWithoutActive(otherUsers)
      }
    }

    getPeoples()
  }, [])

  function createLinksChannels(channelsData) {
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

    if (channelsData) channelsData.map(channel => { allChannels.push(createLinkChannel(channel)) } )
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
    let isMembers = []
    let allUsers
    let chunnels
    let userId

    setAllUsersWithoutActive(users => { allUsers = users; return users })
    setDataChannels(serverChannels => { chunnels = serverChannels; return serverChannels })
    setUserData(data => { userId = data._id; return data })
    allUsers.filter(people => people._id === userId)

    let isNotMembers = allUsers
    chunnels.map(channel => {
      if (channel._id === idActive) {
        for (const user of allUsers) {
          for (const member of channel.members) {
            if ( isMembers.includes(user) ) break
            else if ( user._id === member ) {
              isMembers = isMembers.concat(user)
              isNotMembers = isNotMembers.filter(member => member !== user)
            }
          }
        }
      }
    })
    console.log("isNotMembers ", isNotMembers, "isMembers ", isMembers)
    setChannelMembers(isMembers)
    setNotParticipantsChannel(isNotMembers)
  }

  const createListMembers = useCallback(() => {
    return channelMembers.map( member => {
      return (
        <div key={member._id} id={member._id} className="user-sets__people">
          <Link className="main-font" to={`/chat`}>{member.name}</Link>
        </div>
      )
    })
  }, [channelMembers])


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
            notParticipantsChannel={notParticipantsChannel}
            setNotParticipantsChannel={setNotParticipantsChannel}
            channelMembers={channelMembers}
            invited={invited}
            setInvited={setInvited}
            setChannelMembers={setChannelMembers}

            setModalAddChannelIsOpen={setModalAddChannelIsOpen} 
            setListChannels={setListChannels}
            setDataChannels={setDataChannels}
            setUserData={setUserData}
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
            invited={invited}
            setInvited={setInvited}
            setChannelMembers={setChannelMembers}
          />
        </Modal>
        <div className="user-sets__people">
          <Link className="main-font" to={`/filterContacts`}>Filter Contants</Link>
        </div>
      </div>
    </div>
  )
}