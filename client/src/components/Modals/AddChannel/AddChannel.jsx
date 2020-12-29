import React, { useState, useEffect, useRef, useMemo } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import { useDispatch, useSelector } from 'react-redux';
import { connect } from 'react-redux';
import { postData } from '../../../redux/actions/actions.js';
import { POST_CHANNEL } from '../../../redux/types.js';
import { SelectPeople } from '../SelectPeople/SelectPeople.jsx';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import './add-channel.sass';

const styles = (theme) => ({
  input: {
    height: '5vh',
    width: '33vw',
  },
});

export const AddChannel = withStyles(styles)((props) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.userData._id);
  const token = useSelector((state) => state.token);
  const allUsers = useSelector((state) => state.users);
  const allChannels = useSelector((state) => state.channels);
  const activeChannelId = useSelector((state) => state.activeChannelId);
  const { setModalAddChannelIsOpen, modalAddChannelIsOpen, classes } = props;
  const [isPrivate, setIsPrivate] = useState(false);
  const [invited, setInvited] = useState([]);
  const [form, setForm] = useState({
    name: '',
    discription: '',
    isPrivate: false,
    members: [],
  });
  const buttonCloseRef = useRef();
  const buttonDoneRef = useRef();

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };
  const activeChannel = useMemo(() => {
    if (activeChannelId && allChannels && allChannels[0]) {
      return allChannels.filter((channel) => channel._id === activeChannelId);
    }
    return 'hasNotChannelsOrActiveChannel';
  }, [activeChannelId, allChannels]);

  const isNotMembers = useMemo(() => {
    if (allUsers && allUsers[0] && activeChannel) {
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

  useEffect(() => {
    setNotInvited(isNotMembers);
  }, isNotMembers);

  const doneCreate = async (action) => {
    if (action === 'done' && form.name) {
      const members = invited[0] ? invited.concat(userId) : [userId];
      dispatch(
        postData(
          POST_CHANNEL,
          token,
          { ...form, creator: userId, members },
          userId
        )
      );
    }
    setModalAddChannelIsOpen(false);
  };

  function changeIsPrivate() {
    setForm((prev) => {
      return { ...prev, isPrivate: !isPrivate };
    });
    setIsPrivate(!isPrivate);
  }

  return (
    <div>
      <Dialog
        open={modalAddChannelIsOpen}
        onClose={() => setModalAddChannelIsOpen(false)}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle
          id='form-dialog-title'
          classes={{ root: classes.titleRoot }}
        >
          Create a channel
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Channels are where your team communicates. They’re best when
            organized around a topic — #marketing, for example.
          </DialogContentText>

          <div className='set-channel-forms' id='add-private-channel'>
            <label className='set-channel-forms__label'>Private</label>
            <Checkbox
              style={{ width: '22px' }}
              checked={isPrivate}
              onClick={changeIsPrivate}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
          </div>
          <TextField
            label='Name'
            InputProps={{ className: classes.input }}
            value={form.name.value}
            onChange={changeHandler}
          />

          <TextField
            InputProps={{ className: classes.input }}
            label='Discription'
            id='mui-theme-provider-standard-input'
            value={form.discription.value}
            onChange={changeHandler}
          />
        </DialogContent>
        <SelectPeople
          invited={invited}
          notInvited={notInvited}
          setNotInvited={setNotInvited}
          setInvited={setInvited}
          buttonCloseRef={buttonCloseRef}
          buttonDoneRef={buttonDoneRef}
          done={doneCreate}
        />
      </Dialog>
    </div>
  );
});

const mapDispatchToProps = { postData };

export default connect(null, mapDispatchToProps)(AddChannel);
