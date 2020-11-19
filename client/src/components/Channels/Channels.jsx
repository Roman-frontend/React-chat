import React, { useEffect, useState, useCallback } from 'react';
import {useDispatch, useSelector} from 'react-redux'
import {connect} from 'react-redux'
import {getData} from '../../redux/actions/actions.js'
import {GET_CHANNELS, ACTIVE_CHANNEL_ID} from '../../redux/types.js'
import {Link} from 'react-router-dom';
import Modal from 'react-modal';
import {useAuth} from '../../hooks/auth.hook.js';
import {AddChannel} from '../AddChannel/AddChannel.jsx';
import './channels.sass';
Modal.setAppElement('#root');

export function Channels(props) {
  const dispatch = useDispatch()
  const allChannels = useSelector(state => state.channels)
  const authData = useSelector(state => state.login)
  const token = useSelector(state => state.login.token)
  const userData = useSelector(state => state.userData)
  const {changeLocalStorageUserData} = useAuth();
  const { isNotMembers, listChannelsIsOpen } = props
  const [modalAddChannelIsOpen, setModalAddChannelIsOpen] = useState(false);

  useEffect(() => {
    async function getChannels() {
      console.log(authData)
      await dispatch( getData(GET_CHANNELS, token, null, authData.userData.channels))
    }

    changeLocalStorageUserData(authData)
    getChannels()
  },[authData.userData])

  const createLinksChannels = useCallback((channelsData) => {
    let allChannels = [
      <div 
        key='1' 
        id='1'
        className="user-sets__channel user-sets__channel_active" 
        onClick={() => toActiveChannel(1)}
      >
        <Link className="main-font" to={`/chat`} >&#128274;general</Link>
      </div>
    ]

    if (channelsData) {
      channelsData.map(channel => { 
        allChannels.push(createLinkChannel(channel)) 
      })
    }
    return allChannels
  }, [allChannels])

  function createLinkChannel(channel) {
    return (
      <div 
        key={channel._id} 
        id={channel._id}
        className="user-sets__channel" 
        onClick={() => toActiveChannel(channel._id)}
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

  async function toActiveChannel(idActive) {
    markActiveLinkChannel(idActive)
    dispatch({
      type: ACTIVE_CHANNEL_ID,
      payload: idActive
    })
  }

  function markActiveLinkChannel(idActiveChannel) {
    document.querySelector('.user-sets__channel_active').classList.remove('user-sets__channel_active')
    document.getElementById(idActiveChannel).classList.add('user-sets__channel_active')
  }


	return (
		<div style={
      {display: listChannelsIsOpen ? "block" : "none"}
    }>
      <Modal 
        isOpen={modalAddChannelIsOpen}
        onRequestClose={() => setModalAddChannelIsOpen(false)}
        className={"modal-content"}
        overlayClassName={"modal-overlay"}
      >
        <AddChannel 
          isNotMembers={isNotMembers}
          setModalAddChannelIsOpen={setModalAddChannelIsOpen} 
        />
      </Modal>
      {createLinksChannels(allChannels)}
      <div className="user-sets__channel user-sets__channel_add">
        <p className="main-font" 
          onClick={() => setModalAddChannelIsOpen(true)}
        >
          + Add channel
        </p>
      </div>
    </div>
	)
}

const mapDispatchToProps = {
  getData 
}

export default connect(null, mapDispatchToProps)(Channels)