import React, {useState, useEffect, useMemo} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {connect} from 'react-redux'
import {getData} from '../../redux/actions/actions.js'
import {GET_USERS} from '../../redux/types.js'
import {Channels} from '../Channels/Channels.jsx'
import {ChannelMembers} from '../ChannelMembers/ChannelMembers.jsx'
import './user-sets.sass'

export function SetsUser() {
  const dispatch = useDispatch()
  const allUsers = useSelector(state => state.users)
  const authData = useSelector(state => state.login)
  const allChannels = useSelector(state => state.channels)
  const activeChannelId = useSelector(state => state.activeChannelId)

  const [channelMembers, setChannelMembers] = useState([])
  const [invited, setInvited] = useState([])
  const [listChannelsIsOpen, setListChannelsIsOpen] = useState(true)
  const [listMembersIsOpen, setListMembersIsOpen] = useState(true)

  const activeChannel = useMemo(() => {
    if (activeChannelId && allChannels) {
      return allChannels.filter(channel => channel._id === activeChannelId)
    }
  }, [activeChannelId, allChannels]) 

  const isNotMembers = useMemo(() => {
    if (allUsers && activeChannel) {
      if (activeChannel[0]) {
        return allUsers.filter(user => activeChannel[0].members.includes(user._id) === false)
      }
    }
  }, [allUsers, activeChannel])

  const isMembers = useMemo(() => {
    if (allUsers && activeChannel) {
      if ( activeChannel.length !== 0 ) {
        return allUsers.filter(user => activeChannel[0].members.includes(user._id) === true)
      }
    }
  }, [allUsers])

  useEffect(() => {
    async function getPeoples() {
      await dispatch( getData(GET_USERS, authData.token, authData.userId) )
    }
    getPeoples()
  }, [])

  useEffect(() => { if (isMembers) setChannelMembers(isMembers) }, [isMembers])


  function drawTitles(name, setState, state) {
    if ( state ) {
      return ( 
        <p className="user-sets__nav-channels-name" onClick={() => setState(!state)}>
          &#x25BC; {`${name}`}
        </p> 
      )
    } else {
      return ( 
        <p className="user-sets__nav-channels-name" onClick={() => setState(!state)}>
          &#9654; {`${name}`}
        </p>
      )
    }
  }


  return (
    <div className="main-font user-sets">
      <div className="user-sets__nav-channels">
        { drawTitles("Channels", setListChannelsIsOpen, listChannelsIsOpen) }
        <b className="plus user-sets__nav-channels-plus">+</b>
      </div>
      <Channels 
        isNotMembers={isNotMembers}
        channelMembers={channelMembers}
        invited={invited}
        setInvited={setInvited}
        listChannelsIsOpen={listChannelsIsOpen}
      />
      <div className="user-sets__nav-messages">
        { drawTitles("Direct messages", setListMembersIsOpen, listMembersIsOpen) }
        <b className="plus user-sets__nav-messages-plus">+</b>
      </div>
      <ChannelMembers 
        isNotMembers={isNotMembers}
        channelMembers={channelMembers}
        invited={invited}
        setInvited={setInvited}
        setChannelMembers={setChannelMembers}
        listMembersIsOpen={listMembersIsOpen}
      />
      <p onClick={() => dispatch( getData(authData.userId, "GET", null, authData.token) )}>Dispatch</p>
    </div>
  )
}

const mapDispatchToProps = {
  getData 
}

export default connect(null, mapDispatchToProps)(SetsUser)