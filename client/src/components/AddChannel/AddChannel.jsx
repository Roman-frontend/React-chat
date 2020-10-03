import React, {useState} from 'react'
import {useAuthContext} from '../../context/AuthContext.js'
import {useServer} from '../../hooks/Server.js'
import {SelectPeople} from '../SelectPeople/SelectPeople.jsx'
import './add-channel.sass'


export function AddChannel(props) {
  const {userId} = useAuthContext();
  const {postChannel} = useServer()
  const [form, setForm] = useState({
    name: '', discription: '', people: ''
  })
  const {
    notParticipantsChannel,
    setNotParticipantsChannel,
    channelMembers,
    setInvited,
    invited,
    setChannelMembers,


    setModalAddChannelIsOpen, 
    setListChannels, 
    setDataChannels,
    setUserData,
    createLinkChannel 
  } = props

  const heightParrentDiv = 'set-channel__add_height'

  const changeHandler = event => {
    setForm({ ...form, [event.target.name]: event.target.value, creator: userId, members: [userId] })
  }

  const doneCreate = async () => {
    console.log("doneCreate")
    const newChannel = await postChannel(`/api/channel/post-channel${userId}`, form)

    if (newChannel) {
      console.log(newChannel)
      const linkChannel = createLinkChannel(newChannel)

      setUserData(prevUserData => {
        return {
          ...prevUserData,
          channels: prevUserData.channels.concat(newChannel._id)
        }
      })
/*      setDataChannels(prevData => { 
        const a = prevData.concat(newChannel) 
        console.log(a)
        return a
      })*/
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
          heightParrentDiv={heightParrentDiv}
        />
      </form>

      <button className="set-channel__button" onClick={() => setModalAddChannelIsOpen(false)}>Close</button>
      <button className="set-channel__button" onClick={doneCreate}>Create</button>
    </div>
  )
}