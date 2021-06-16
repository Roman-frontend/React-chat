import React, { useState, useEffect, useRef } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import { gql, useQuery, useMutation } from '@apollo/client';
import { AUTH, GET_USERS } from '../../../GraphQLApp/queryes';
import {
  CREATE_CHANNEL,
  CHANNELS,
} from '../../SetsUser/SetsUserGraphQL/queryes';
import { SelectPeople } from '../SelectPeople/SelectPeople.jsx';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import './add-channel.sass';
import { reactiveVarChannels } from '../../../GraphQLApp/reactiveVars';

const styles = (theme) => ({
  input: {
    height: '5vh',
    width: '33vw',
  },
});

export const AddChannel = withStyles(styles)((props) => {
  const {
    setAlertData,
    setModalAddChannelIsOpen,
    modalAddChannelIsOpen,
    classes,
  } = props;
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
    if (action === 'done') {
      const listInvited = invited[0] ? invited.concat(auth.id) : [auth.id];
      createChannel({
        variables: { ...form, admin: auth.id, members: listInvited },
      });
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
