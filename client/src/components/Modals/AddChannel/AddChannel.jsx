import React, { useState, useEffect, useRef, useMemo } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import { useDispatch, useSelector } from 'react-redux';
import { connect } from 'react-redux';
import { postChannel } from '../../../redux/actions/actions.js';
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
  const { setModalAddChannelIsOpen, modalAddChannelIsOpen, classes } = props;
  const [isPrivate, setIsPrivate] = useState(false);
  const notInvitedRef = useRef();
  const [form, setForm] = useState({
    name: '',
    discription: '',
    isPrivate: false,
    members: [],
  });

  useEffect(() => {
    if (allUsers && allUsers[0]) {
      const peoplesInvite = allUsers.filter((people) => people._id !== userId);
      notInvitedRef.current = peoplesInvite;
    }
  }, [allUsers]);

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const doneCreate = (action, invited = []) => {
    if (action === 'done' && form.name) {
      const arrInvitedId = invited[0]
        ? invited.map((people) => people._id).concat(userId)
        : [userId];

      console.log('postChannel');
      dispatch(
        postChannel(
          token,
          { ...form, creator: userId, members: arrInvitedId },
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
            name='name'
            value={form.name.value}
            onChange={changeHandler}
          />

          <TextField
            InputProps={{ className: classes.input }}
            label='Discription'
            id='mui-theme-provider-standard-input'
            name='discription'
            value={form.discription.value}
            onChange={changeHandler}
          />
        </DialogContent>
        <SelectPeople notInvitedRef={notInvitedRef} done={doneCreate} />
      </Dialog>
    </div>
  );
});

const mapDispatchToProps = { postChannel };

export default connect(null, mapDispatchToProps)(AddChannel);
