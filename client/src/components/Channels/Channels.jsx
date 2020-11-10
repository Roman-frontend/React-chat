import React, { useEffect, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux'
import {connect} from 'react-redux'
import {getData} from '../../redux/actions/actions.js'
import {GET_CHANNELS, GET_MESSAGES, ACTIVE_CHANNEL_ID} from '../../redux/types.js'
import {Link} from 'react-router-dom';
import Modal from 'react-modal';
import {useAuth} from '../../hooks/auth.hook.js';
import {AddChannel} from '../AddChannel/AddChannel.jsx';
import './channels.sass';
Modal.setAppElement('#root');

export function Channels(props) {
  const dispatch = useDispatch()
  const channels = useSelector(state => state.channels)
  const authData = useSelector(state => state.login)
  const {changeLocalStorageUserData} = useAuth();
  const {
    notParticipantsChannel,
    setNotParticipantsChannel,
    setInvited,
    invited,
    setChannelName,
    getListMembersAndNot,
    listChannelsIsOpen
  } = props
	const [listChannels, setListChannels] = useState([]);
  const [modalAddChannelIsOpen, setModalAddChannelIsOpen] = useState(false);

  useEffect(() => {
    async function getChannels() {
      console.log(authData)
      await dispatch( getData(GET_CHANNELS, authData.token, null, authData.userData.channels))
    }
    changeLocalStorageUserData(authData)

    getChannels()
  },[authData.userData])

  useEffect(() => {
    console.log(channels)
    if(channels) {
      const linksChannels = createLinksChannels(channels)
      setListChannels(linksChannels)
    }
  }, [channels])

  function createLinksChannels(channelsData) {
    let allChannels = [
      <div 
        key='1' 
        id='1'
        className="user-sets__channel user-sets__channel_active" 
        onClick={() => toActiveChannel(1, "general")}
      >
        <Link className="main-font" to={`/chat`} >&#128274;general</Link>
      </div>
    ]

    if (channelsData) channelsData.map(channel => { allChannels.push(createLinkChannel(channel)) } )
    return allChannels
  }

  function createLinkChannel(channel) {
    console.log(channel)
    return (
      <div 
        key={channel._id} 
        id={channel._id}
        className="user-sets__channel" 
        onClick={() => toActiveChannel(channel._id, `#${channel.name}`, channel.isPrivate)}
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

    if ( idActive !== 1 ) { 
      await dispatch(getData(GET_MESSAGES, authData.token, idActive, {userId: authData.userId})) 
    } else return null

    redrawListMembersAndNo(idActive)

    setChannelName(nameActive)
    dispatch({
      type: ACTIVE_CHANNEL_ID,
      payload: idActive
    })

  }

  function markActiveLinkChannel(idActiveChannel) {
    document.querySelector('.user-sets__channel_active').classList.remove('user-sets__channel_active')
    document.getElementById(idActiveChannel).classList.add('user-sets__channel_active')
  }

  function redrawListMembersAndNo(idActiveChannel) {
    getListMembersAndNot(idActiveChannel, channels)
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