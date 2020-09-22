import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {useAuthContext} from '../../context/AuthContext.js'
import {useServer} from '../../hooks/Server.js'
import './add-people-to-channel.sass'


export function AddPeopleToChannel(props) {
  const {name, userId} = useAuthContext();
  const {getUsers} = useServer();
  const { setModalAddPeopleIsOpen, activeChannelName } = props
  const [form, setForm] = useState({people: ''})

	useEffect(() => {
    async function getData() {
      const serverUsers = await getUsers(`/api/channel/get-users${userId}`)
      console.log("Users: ", serverUsers)
    }

    getData()
  }, [])

  function createMainLabel() {
    if(activeChannelName.match(/^#/)) {
    	return <p className="set-channel-forms__main-label-text">Invite people to {`${activeChannelName}`}</p>

    } else {
    	return <p className="set-channel-forms__main-label-text">Invite people to &#128274;{activeChannelName}</p>
    }
  }

  const changeHandler = event => {
    setForm({ ...form, [event.target.name]: event.target.value})
  }

  const doneCreate = async () => {
  	setModalAddPeopleIsOpen(false)
/*    const newPeople = await postChannel('/api/channel/post-channel', form)

    if (newChannel) {
      const linkChannel = createLinkChannel(newChannel)

      setListChannels(prevChannels => { return prevChannels.concat(linkChannel) })
    }*/
  }

	return (
		<div className="set-channel">

      <form className="set-channel__main-label">
      	<label>{createMainLabel()}</label>
	      	<div className="set-channel-forms">
	          <label className="set-channel-forms__label">Peoples</label>
	          <input 
	            placeholder="add peoples to channel" 
	            className="set-channel-forms__input"
	            type="text"
	            id="people"
	            name="people"
	            value={form.people}
	            onChange={changeHandler} 
	            onClick={() => console.log("aaa")}
	          />
	        </div>
	      <button 
	      	className="set-channel__button" 
	      	onClick={() => setModalAddPeopleIsOpen(false)}
	      >
	      	Close
	      </button>
	      <button 
	      	className="set-channel__button" 
	      	onClick={doneCreate}
	      >
	      	Invite
	      </button>
      </form>

    </div>
  )
}