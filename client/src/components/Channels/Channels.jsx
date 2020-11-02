import React, { useEffect, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux'
import {connect} from 'react-redux'
import {getData} from '../../redux/actions/actions.js'
import {GET_CHANNELS, GET_MESSAGES} from '../../redux/types.js'
import {Link} from 'react-router-dom';
import Modal from 'react-modal';
import {useAuthContext} from '../../context/AuthContext.js';
import {useMessagesContext} from '../../context/MessagesContext.js';
import {AddChannel} from '../AddChannel/AddChannel.jsx';
import './channels.sass';
Modal.setAppElement('#root');

export function Channels(props) {
  const dispatch = useDispatch()
  const channels = useSelector(state => state.channels)
  const messages = useSelector(state => state.messages)
  const {changeLocalStorageUserData, userData, userId, setUserId, token} = useAuthContext();
  const {setMessages, activeChannelId, setActiveChannelId, setDataChannels, setIsBlockedInput } = useMessagesContext();
  const {
    notParticipantsChannel,
    setNotParticipantsChannel,
    setInvited,
    invited,
    channelMembers,
    setChannelName,
    getListMembersAndNot,
    listChannelsIsOpen
  } = props
	const [listChannels, setListChannels] = useState([]);
  const [modalAddChannelIsOpen, setModalAddChannelIsOpen] = useState(false);

  useEffect(() => {
    console.log(userData)
    changeLocalStorageUserData(userData)
    async function getChannels() {
      await dispatch( getData(GET_CHANNELS, token, null, userData.channels))
    }

    getChannels()
  },[userData])

  useEffect(() => {
    console.log(channels)
    if(channels) {
      setDataChannels(channels.userChannels)
      const linksChannels = createLinksChannels(channels.userChannels)
      setListChannels(linksChannels)
    }
  }, [channels])

  useEffect(() => {
    if (messages && messages !== "403") {
      setMessages(messages.messages.reverse())
    } else { setMessages([]) }
  }, [messages])

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
        onClick={(idActive, nameActive) => toActiveChannel(channel._id, `#${channel.name}`, channel.isPrivate)}
      >
        {createName(channel.isPrivate, channel.name)}
      </div>
    )
  }

  function createName(isPrivate, name) {
    return ( isPrivate ? 
      <Link className="main-font" to={`/chat`}>&#128274;{name}</Link> :
      <Link className="main-font" to={`/chat`}>{`#${name}`}</Link>
    );
  }

  async function toActiveChannel(idActive, nameActive, isPrivate) {
    markActiveLinkChannel(idActive)

    await getMessagesChannel(idActive)

    redrawListMembersAndNo(idActive)

    determineLetUserAccessToChat(isPrivate)

    setChannelName(nameActive)
    setActiveChannelId(idActive)

  }

  function markActiveLinkChannel(idActiveChannel) {
    document.querySelector('.user-sets__channel_active').classList.remove('user-sets__channel_active')
    document.getElementById(idActiveChannel).classList.add('user-sets__channel_active')
  }

  async function getMessagesChannel(idActiveChannel) {
    let lastUserId
    setUserId(prevId => { lastUserId = prevId; return prevId })

    await dispatch( getData(GET_MESSAGES, token, idActiveChannel, {userId: lastUserId} ) )
  }

  function redrawListMembersAndNo(idActiveChannel) {
    let channels
    setDataChannels(serverChannels => {
      channels = serverChannels;
      return serverChannels 
    })

    getListMembersAndNot(idActiveChannel, channels)
  }

  function determineLetUserAccessToChat(isPrivate) {
  /*!isPrivate ? setIsBlockedInput(false) : 
    channelMembers.filter(member => member._id === userId) ? 
    setIsBlockedInput(false) : setIsBlockedInput(true);*/

    if (!isPrivate) {
      setIsBlockedInput(false)

    } else if ( channelMembers.filter(member => member._id === userId) ) {
      setIsBlockedInput(false) 

    } else {
      setIsBlockedInput(true);
    }
  }


	return (
		<div style={{display: listChannelsIsOpen ? "block" : "none"}}>
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

const mapDispatchToProps = {
  getData 
}

export default connect(null, mapDispatchToProps)(Channels)