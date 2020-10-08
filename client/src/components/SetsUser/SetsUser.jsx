import React, {useState, useEffect, useCallback} from 'react'
import {Link} from 'react-router-dom'
import Modal from 'react-modal'
import {useAuthContext} from '../../context/AuthContext.js'
import {useServer} from '../../hooks/Server.js'
import {Channels} from '../Channels/Channels.jsx'
import {ChannelMembers} from '../ChannelMembers/ChannelMembers.jsx'
import {AddPeopleToChannel} from '../AddPeopleToChannel/AddPeopleToChannel.jsx'
import './user-sets.sass'
Modal.setAppElement('#root')

export default function SetsUser(props) {
  const { userId, setUserData } = useAuthContext();
  const {getData} = useServer();

  const [notParticipantsChannel, setNotParticipantsChannel] = useState([])
  const [channelMembers, setChannelMembers] = useState([])
  const [allUsersWithoutActive, setAllUsersWithoutActive] = useState([])
  const [invited, setInvited] = useState([])
  const [channelName, setChannelName] = useState("general")
  const [listChannelsIsOpen, setListChannelsIsOpen] = useState(true)
  const [listMembersIsOpen, setListMembersIsOpen] = useState(true)

  useEffect(() => {
    async function getPeoples() {
      const serverUsers = await getData("getUsers", userId)

      if (serverUsers) {
        //НЕ ВИДАЛЯТИ!!! Фільтрує список зареєстрованих людей видаляючи залогіненого користувача
        /*const otherUsers = serverUsers.users.filter(people => people._id !== userId)
        setAllUsersWithoutActive(otherUsers)*/

        //Тимчасовий сетСтейт
        console.log(serverUsers.users)
        setAllUsersWithoutActive(serverUsers.users)
      }
    }

    getPeoples()
  }, [])

  function getListMembersAndNot(idActive, channels) {
    let isMembers = []
    let allUsers
    let userId
    setAllUsersWithoutActive(users => { 
      allUsers = users; 
      console.log("users", users)
      return users 
    })
    setUserData(data => { userId = data._id; return data })

    //НЕ ВИДАЛЯТИ!!! Фільтрує список учасників чату видаляючи залогіненого користувача
    //allUsers = allUsers.filter(people => people._id !== userId)

    let isNotMembers = allUsers
    console.log(allUsers, channels)
    channels.map(channel => {
      if (channel._id === idActive) {
        console.log(allUsers)
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
    setChannelMembers(isMembers)
    setNotParticipantsChannel(isNotMembers)
  }

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

  function drawLists(component, state) {
    return state ? component : null
  }


  return (
    <div className="main-font user-sets">
      <div className="user-sets__nav-channels">
        { drawTitles("Channels", setListChannelsIsOpen, listChannelsIsOpen) }
        <b className="plus user-sets__nav-channels-plus">+</b>
      </div>
      { drawLists(
        <Channels 
          getListMembersAndNot={getListMembersAndNot}
          setChannelName={setChannelName}
          notParticipantsChannel={notParticipantsChannel}
          setNotParticipantsChannel={setNotParticipantsChannel}
          invited={invited}
          setInvited={setInvited}
        />,
        listChannelsIsOpen
      )}
      <div className="user-sets__nav-messages">
        { drawTitles("Direct messages", setListMembersIsOpen, listMembersIsOpen) }
        <b className="plus user-sets__nav-messages-plus">+</b>
      </div>
      { drawLists(
        <ChannelMembers 
          channelMembers={channelMembers}
          channelName={channelName} 
          notParticipantsChannel={notParticipantsChannel}
          setNotParticipantsChannel={setNotParticipantsChannel}
          invited={invited}
          setInvited={setInvited}
          setChannelMembers={setChannelMembers}
        />,
        listMembersIsOpen
      )}
    </div>
  )
}