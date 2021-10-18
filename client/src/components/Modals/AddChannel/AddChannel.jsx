import React, { useState, useEffect, useRef } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { AUTH, GET_USERS } from '../../../GraphQLApp/queryes';
import { CREATE_CHANNEL } from '../../SetsUser/SetsUserGraphQL/queryes';
import { SelectPeople } from '../SelectPeople/SelectPeople.jsx';
import './add-channel.sass';
import { red } from '@material-ui/core/colors';

const styles = (theme) => ({
  input: {
    height: '30px',
    width: '33vw',
    color: '#0000b5',
  },
});

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    width: '520px',
    height: '470px',
    margin: 0,
  },
}));

const helperTextStyles = makeStyles((theme) => ({
  root: {
    margin: 4,
  },
  error: {
    '&.MuiFormHelperText-root.Mui-error': {
      color: red[500],
    },
  },
}));

export const AddChannel = withStyles(styles)((props) => {
  const {
    setAlertData,
    setModalAddChannelIsOpen,
    modalAddChannelIsOpen,
    isErrorInPopap,
    setIsErrorInPopap,
    classes,
  } = props;
  const popapClasses = useStyles();
  const helperTestClasses = helperTextStyles();
  const { data: auth } = useQuery(AUTH);
  const { data: allUsers } = useQuery(GET_USERS);
  const [isPrivate, setIsPrivate] = useState(false);
  const notInvitedRef = useRef();
  const [form, setForm] = useState({
    name: '',
    discription: '',
    isPrivate: false,
    members: [],
  });
  const [createChannel] = useMutation(CREATE_CHANNEL, {
    update(cache, { data: { channel } }) {
      cache.modify({
        fields: {
          userChannels(existingChannels) {
            const newChannelRef = cache.writeFragment({
              data: channel.create,
              fragment: gql`
                fragment NewChannel on Channel {
                  id
                  name
                  admin
                  members
                  isPrivate
                }
              `,
            });
            return [...existingChannels, newChannelRef];
          },
        },
      });
    },
    /* update: (proxy, { data: { channel } }) => {
      const ready = proxy.readQuery({
        query: CHANNELS,
        variables: { channelsId: reactiveVarChannels() },
      });
      proxy.writeQuery({
        query: CHANNELS,
        data: { userChannels: [...ready.userChannels, channel.create] },
      });
    }, */
    onCompleted(data) {
      const storage = JSON.parse(sessionStorage.getItem('storageData'));
      const toStorage = JSON.stringify({
        ...storage,
        channels: [...storage.channels, data.channel.create.id],
      });
      sessionStorage.setItem('storageData', toStorage);
      //reactiveVarChannels([...reactiveVarChannels(), data.channel.create.id]);
      setAlertData(data.channel.create);
    },
    onError(error) {
      console.log(`Помилка при створенні каналу ${error}`);
    },
  });

  useEffect(() => {
    if (allUsers && allUsers.users && auth) {
      const peoplesInvite = allUsers.users.filter(
        (people) => people.id !== auth.id
      );
      notInvitedRef.current = peoplesInvite;
    }
  }, [allUsers]);

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const doneCreate = (action, invited = []) => {
    if (action === 'done' && form.name.trim() !== '') {
      const listInvited = invited[0] ? invited.concat(auth.id) : [auth.id];
      createChannel({
        variables: { ...form, admin: auth.id, members: listInvited },
      });
      setIsErrorInPopap(false);
      setModalAddChannelIsOpen(false);
    } else {
      setIsErrorInPopap(true);
    }
  };

  const closePopap = () => {
    setIsErrorInPopap(false);
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
        scroll='body'
        classes={{ paper: popapClasses.dialogPaper }}
      >
        <DialogTitle id='form-dialog-title'>Create a channel</DialogTitle>
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
              error
            />
          </div>
          <TextField
            label='Name'
            InputProps={{ className: classes.input }}
            name='name'
            required={true}
            helperText={isErrorInPopap ? 'required' : ''}
            FormHelperTextProps={{ classes: helperTestClasses }}
            value={form.name.value}
            onChange={changeHandler}
            error
          />

          <TextField
            InputProps={{ className: classes.input }}
            label='Discription'
            style={{ display: 'flex' }}
            id='mui-theme-provider-standard-input'
            name='discription'
            value={form.discription.value}
            onChange={changeHandler}
            error
          />
          <SelectPeople
            isDialogChanged={true}
            closePopap={closePopap}
            notInvitedRef={notInvitedRef}
            isErrorInPopap={isErrorInPopap}
            done={doneCreate}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
});
