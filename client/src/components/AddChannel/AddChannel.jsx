import React, { useState } from 'react'
import {useAuthContext} from '../../context/AuthContext.js'
import {useServer} from '../../hooks/Server.js'
import {SelectPeople} from '../SelectPeople/SelectPeople.jsx'
import './add-channel.sass'


export function AddChannel(props) {
  const { userId, setUserData, token } = useAuthContext();
  const { postData } = useServer();
  const {
    notParticipantsChannel,
    setNotParticipantsChannel,
    setInvited,
    invited,

    setModalAddChannelIsOpen, 
    setListChannels, 
    createLinkChannel 
  } = props
  const [notInvited, setNotInvited] = useState(notParticipantsChannel)
  const [isPrivate, setIsPrivate] = useState(false)
  const [form, setForm] = useState({
    name: '', discription: '', isPrivate: false, members: []
  })

  const heightParrentDiv = 'set-channel__add_height'

  const changeHandler = event => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const doneCreate = async () => {
    const members = invited[0] ? invited.concat(userId) : [userId]
    const resServer = await postData("postChannel", token, { ...form, creator: userId, members }, userId)

    if (resServer.channel) {
      const newChannel = resServer.channel
      const linkChannel = createLinkChannel(newChannel)

      setUserData(prevUserData => {
        return { ...prevUserData, channels: prevUserData.channels.concat(newChannel._id) }
      })
      setListChannels(prevList => { return prevList.concat(linkChannel) })
      setModalAddChannelIsOpen(false)
    }
  }

  function createForm(param) {
    const {...rest} = param
    return (
      <div className="set-channel-forms">
        <label className={param.labelClassName}>{param.labelName}</label>
        <input 
          placeholder={param.placeholder} 
          className={param.className}
          type="text"
          id={param.id}
          name={param.name}
          value={param.value}
          onChange={changeHandler} 
        />
      </div>
    )
  }

  function changeIsPrivate() {
    setForm(prev => {
      return { 
        ...prev, 
        isPrivate: !isPrivate 
      } 
    })
    setIsPrivate(!isPrivate)
  }

  function closeAddChannel() {
    setNotInvited(notParticipantsChannel)
    setInvited([])
    setModalAddChannelIsOpen(false)
  }


  return (
    <div className="set-channel">
      <label>Create a channel</label>
      <p className="set-channel__discription-create">
        Channels are where your team communicates. They’re best when organized around a topic — #marketing, for example.
      </p>

      <form>
        {createForm({
          labelName: "Name", 
          labelClassName: "set-channel-forms__label",
          placeholder: "input name channel", 
          className: "set-channel-forms__input",
          id: "name", 
          name: "name", 
          value: form.name
        })}

        <div className="set-channel-forms">
          <label className="set-channel-forms__label">Discription</label>
          <input 
            placeholder="input description channel" 
            className="set-channel-forms__input"
            type="text"
            id="discription"
            name="discription"
            value={form.discription}
            onChange={changeHandler} 
          />
        </div>

        <SelectPeople 
          notParticipantsChannel={notParticipantsChannel}
          setNotParticipantsChannel={setNotParticipantsChannel}
          invited={invited}
          setInvited={setInvited}
          notInvited={notInvited}
          setNotInvited={setNotInvited}
          heightParrentDiv={heightParrentDiv}
        />

        <div className="set-channel-forms" id="add-private-channel">
          <label className="set-channel-forms__label" >Private channel</label>
          <input 
            className="set-channel-forms__input set-channel-forms__input_width" 
            type="checkbox" 
            id="checkbox" 
            name="checkbox" 
            onClick={changeIsPrivate}
          />
        </div>
      </form>

      <button className="set-channel__button" onClick={closeAddChannel}>Close</button>
      <button className="set-channel__button" onClick={doneCreate}>Create</button>
    </div>
  )
}