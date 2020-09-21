import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import {useAuthContext} from '../../context/AuthContext.js'
import {useServer} from '../../hooks/Server.js'
import './add-channel.sass'


export function AddChannel(props) {
  const {userId} = useAuthContext();
  const {postChannel} = useServer()
  const [form, setForm] = useState({
    name: '', discription: '', people: ''
  })
  const { setModalIsOpen, setListChannels, createLinkChannel } = props

  const changeHandler = event => {
    setForm({ ...form, [event.target.name]: event.target.value, creator: userId })
  }

  const doneCreate = async () => {
    const newChannel = await postChannel('/api/channel/post-channel', form)

    if (newChannel) {
      const linkChannel = createLinkChannel(newChannel)
      setListChannels(prevChannels => { 
        return prevChannels.concat(linkChannel) 
      })

      setModalIsOpen(false)
    }
  }

  function createForm(param) {
    const {...rest} = param
    return (
      <div>
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
    <div className="new-channel">
      <label className="new-channel__label-create">Create a channel</label>
      <p className="new-channel__discription-create">
        Channels are where your team communicates. They’re best when organized around a topic — #marketing, for example.
      </p>

      <div className="new-channel__forms">
        {createForm({
          labelName: "Name", 
          labelClassName: "label-name",
          placeholder: "input name channel", 
          className: null,
          id: "name", 
          name: "name", 
          value: form.name
        })}

        <div>
          <label className="label-description">Discription</label>
          <input 
            placeholder="input description channel" 
            type="text"
            id="discription"
            name="discription"
            value={form.discription}
            onChange={changeHandler} 
          />
        </div>

        <div>
          <label className="label-description">Peoples</label>
          <input 
            placeholder="add peoples to channel" 
            className="new-channel__forms_left"
            type="text"
            id="people"
            name="people"
            value={form.people}
            onChange={changeHandler} 
          />
        </div>
      </div>

      <button className="new-channel__button" onClick={() => setModalIsOpen(false)}>Close</button>
      <button className="new-channel__button" onClick={doneCreate}>Create</button>
    </div>
  )
}