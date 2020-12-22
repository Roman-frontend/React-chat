import React, { useState, useEffect, useRef, useMemo } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { connect } from 'react-redux';
import { postData } from '../../../redux/actions/actions.js';
import { POST_CHANNEL } from '../../../redux/types.js';
import { SelectPeople } from '../SelectPeople/SelectPeople.jsx';
import './add-channel.sass';

export function AddChannel(props) {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.userData._id);
  const token = useSelector((state) => state.token);
  const allUsers = useSelector((state) => state.users);
  const allChannels = useSelector((state) => state.channels);
  const activeChannelId = useSelector((state) => state.activeChannelId);
  const { setModalAddChannelIsOpen } = props;
  const [isPrivate, setIsPrivate] = useState(false);
  const [invited, setInvited] = useState([]);
  const [form, setForm] = useState({
    name: '',
    discription: '',
    isPrivate: false,
    members: [],
  });
  const parrentDivRef = useRef();
  const checkboxRef = useRef();
  const buttonCloseRef = useRef();
  const buttonDoneRef = useRef();
  const heightParrentDiv = 'set-channel__add_height';
  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };
  const activeChannel = useMemo(() => {
    if (activeChannelId && allChannels[0]) {
      return allChannels.filter((channel) => channel._id === activeChannelId);
    }
    return 'hasNotChannelsOrActiveChannel';
  }, [activeChannelId, allChannels]);

  const isNotMembers = useMemo(() => {
    if (allUsers && activeChannel) {
      if (activeChannel === 'hasNotChannelsOrActiveChannel') {
        return allUsers;
      } else if (activeChannel[0]) {
        return allUsers.filter(
          (user) => activeChannel[0].members.includes(user._id) === false
        );
      }
    }
  }, [allUsers, activeChannel]);
  const [notInvited, setNotInvited] = useState(isNotMembers);

  const doneCreate = async () => {
    const members = invited[0] ? invited.concat(userId) : [userId];
    await dispatch(
      postData(
        POST_CHANNEL,
        token,
        { ...form, creator: userId, members },
        userId
      )
    );
    setModalAddChannelIsOpen(false);
  };

  function createForm(param) {
    return (
      <div className='set-channel-forms'>
        <label className={param.labelClassName}>{param.labelName}</label>
        <input
          placeholder={param.placeholder}
          className={param.className}
          type='text'
          id={param.id}
          name={param.name}
          value={param.value}
          onChange={changeHandler}
        />
      </div>
    );
  }

  function changeIsPrivate() {
    setForm((prev) => {
      return {
        ...prev,
        isPrivate: !isPrivate,
      };
    });
    setIsPrivate(!isPrivate);
  }

  function closeAddChannel() {
    setInvited([]);
    setModalAddChannelIsOpen(false);
  }

  return (
    <div className='set-channel' ref={parrentDivRef}>
      <label>Create a channel</label>
      <p className='set-channel__discription-create'>
        Channels are where your team communicates. They’re best when organized
        around a topic — #marketing, for example.
      </p>

      <form>
        {createForm({
          labelName: 'Name',
          labelClassName: 'set-channel-forms__label',
          placeholder: 'input name channel',
          className: 'set-channel-forms__input',
          id: 'name',
          name: 'name',
          value: form.name,
        })}

        <div className='set-channel-forms'>
          <label className='set-channel-forms__label'>Discription</label>
          <input
            placeholder='input description channel'
            className='set-channel-forms__input'
            type='text'
            id='discription'
            name='discription'
            value={form.discription}
            onChange={changeHandler}
          />
        </div>

        <SelectPeople
          invited={invited}
          notInvited={notInvited}
          setNotInvited={setNotInvited}
          setInvited={setInvited}
          parrentDivRef={parrentDivRef}
          checkboxRef={checkboxRef}
          buttonCloseRef={buttonCloseRef}
          buttonDoneRef={buttonDoneRef}
          heightParrentDiv={heightParrentDiv}
        />

        <div className='set-channel-forms' id='add-private-channel'>
          <label className='set-channel-forms__label'>Private channel</label>
          <Checkbox
            className='set-channel-forms__input set-channel-forms__input_width'
            type='checkbox'
            id='checkbox'
            name='checkbox'
            checked={isPrivate}
            ref={checkboxRef}
            onChange={changeIsPrivate}
            inputprops={{ 'aria-label': 'primary checkbox' }}
          />
        </div>
      </form>

      <button
        className='set-channel__button'
        onClick={closeAddChannel}
        ref={buttonCloseRef}
      >
        Close
      </button>

      <button
        className='set-channel__button'
        onClick={doneCreate}
        ref={buttonDoneRef}
      >
        Create
      </button>
    </div>
  );
}

const mapDispatchToProps = {
  postData,
};

export default connect(null, mapDispatchToProps)(AddChannel);
