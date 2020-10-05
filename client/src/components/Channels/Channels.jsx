import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import Modal from 'react-modal';
import {useAuthContext} from '../../context/AuthContext.js';
import {useMessagesContext} from '../../context/MessagesContext.js';
import {useServer} from '../../hooks/Server.js';
import {AddChannel} from '../AddChannel/AddChannel.jsx';
import './channels.sass';
Modal.setAppElement('#root');

export function Channels(props) {
  const {changeLocalStorageUserData, userData} = useAuthContext();
  const {setMessages, activeChannelId, setActiveChannelId} = useMessagesContext();
  const {getData} = useServer();
  const {
    notParticipantsChannel,
    setNotParticipantsChannel,
    setInvited,
    invited,
    setChannelName,
    getListMembersAndNot
  } = props
	const [listChannels, setListChannels] = useState([]);
  const [dataChannels, setDataChannels] = useState(null);
  const [modalAddChannelIsOpen, setModalAddChannelIsOpen] = useState(false);

  useEffect(() => {
    async function createListChannels() {
      const serverChunnels = await getData("getChannels", null, userData.channels)
      changeLocalStorageUserData(userData)
      if (serverChunnels) { 
        setDataChannels(serverChunnels.userChannels)
        const linksChannels = createLinksChannels(serverChunnels.userChannels)
        setListChannels(linksChannels)
      }
    }

    if (userData) createListChannels()
  }, [userData])

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
    const receivedServerMessages = await getData("getMessages", idActive)
    if (receivedServerMessages) setMessages(receivedServerMessages.messages.reverse())
    let chunnels
    setDataChannels(serverChannels => { chunnels = serverChannels; return serverChannels })
    getListMembersAndNot(idActive, chunnels)

    setChannelName(nameActive)
    setActiveChannelId(idActive)
  }


	return (
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
          invited={invited}
          setInvited={setInvited}
          setModalAddChannelIsOpen={setModalAddChannelIsOpen} 
          setListChannels={setListChannels}
          setDataChannels={setDataChannels}
          createLinkChannel={createLinkChannel}
        />
      </Modal>
      {listChannels}
    </div>
	)
}