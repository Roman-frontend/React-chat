import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GroupIcon from '@mui/icons-material/Group';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import { Box } from '@mui/system';
import { Members } from './Members';
import { ConversationMembers } from '../../Modals/ConversationHeader/ConversationMembers';
import { AddPeopleToChannel } from '../../Modals/AddPeopleToChannel/AddPeopleToChannel';
import {
  CHANNELS,
  ADD_MEMBER_CHANNEL,
} from '../../SetsUser/SetsUserGraphQL/queryes';
import { activeChatId } from '../../../GraphQLApp/reactiveVars.js';
import ChannelsRightBar from '../../SetsUser/Channels/ChannelsRightBar';

export const ConversationHeaderChannel = (props) => {
  const {
    isErrorInPopap,
    setIsErrorInPopap,
    modalAddPeopleIsOpen,
    setModalAddPeopleIsOpen,
  } = props;
  const theme = useTheme();
  const { data: channels } = useQuery(CHANNELS);
  const { enqueueSnackbar } = useSnackbar();
  const [modalIsShowsMembers, setModalIsShowsMembers] = useState(false);
  const [isOpenRightBarChannels, setIsOpenRightBarChannels] = useState(false);
  const chatNameRef = useRef('#general');
  const activeChannelId = useReactiveVar(activeChatId).activeChannelId;

  const [addMemberToChannel] = useMutation(ADD_MEMBER_CHANNEL, {
    update: (cache, { data: { channel } }) => {
      if (channels && Array.isArray(channels.userChannels)) {
        const channelsWithChannelHasMember = channels.userChannels.map(
          (userChannel) => {
            if (userChannel && userChannel.id === channel.addMember.id) {
              return { ...userChannel, members: channel.addMember.members };
            }
            return userChannel;
          }
        );
        cache.writeQuery({
          query: CHANNELS,
          data: { ...channels, userChannels: channelsWithChannelHasMember },
        });
      }
    },
    onCompleted(data) {
      //console.log('data   ', data);
      enqueueSnackbar('User successfully added', { variant: 'success' });
    },
    onError(error) {
      console.log(`Помилка при додаванні учасника ${error}`);
      enqueueSnackbar('User isn`t added', { variant: 'error' });
    },
  });

  const activeChannel = useMemo(() => {
    if (activeChannelId && channels && Array.isArray(channels.userChannels)) {
      return channels.userChannels.find(
        (channel) => channel !== null && channel.id === activeChannelId
      );
    }
  }, [activeChannelId, channels]);

  useEffect(() => {
    if (activeChannel) {
      chatNameRef.current = activeChannel.name;
    }
  }, [activeChannel]);

  function doneInvite(action, invited = []) {
    if (action === 'done' && invited[0]) {
      addMemberToChannel({ variables: { invited, chatId: activeChannelId } });
      setModalAddPeopleIsOpen(false);
    } else {
      setIsErrorInPopap(true);
    }
  }

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return null;
    }

    setIsOpenRightBarChannels(open);
  };

  return (
    <div style={{ background: theme.palette.primary.main }}>
      <Grid
        container
        spacing={1}
        style={{ alignItems: 'center', height: '4.3rem' }}
        justify='space-between'
      >
        <Grid item xs={6} style={{ margin: '0vw 2vw', padding: 0 }}>
          <b className='conversation__name'>
            ✩ {activeChannel ? activeChannel.name : '#general'}
          </b>
        </Grid>
        <Grid
          item
          xs={3}
          style={{
            alignSelf: 'center',
            flexBasis: 'min-content',
            margin: '0px 8px',
          }}
        >
          <Members
            activeChannel={activeChannel}
            setModalIsShowsMembers={setModalIsShowsMembers}
          />
        </Grid>
        <Grid item xs={1} style={{ textAlign: 'center', margin: '0px 8px' }}>
          <GroupAddIcon
            style={{ fontSize: 50, cursor: 'pointer' }}
            onClick={() => setModalAddPeopleIsOpen(true)}
          />
        </Grid>
        <Grid
          item
          xs={1}
          style={{
            alignSelf: 'center',
            cursor: 'pointer',
            padding: 0,
            margin: '0px 8px',
          }}
        >
          <IconButton
            edge='end'
            aria-label='account of current user'
            aria-haspopup='true'
            color='inherit'
            onClick={toggleDrawer(true)}
          >
            <GroupIcon
              style={{
                background: 'cadetblue',
                borderRadius: '50%',
                fontSize: 40,
              }}
            />
          </IconButton>
        </Grid>
      </Grid>
      <div>
        <React.Fragment>
          <Drawer
            anchor='right'
            sx={{
              '& .MuiDrawer-paperAnchorRight': {
                background: theme.palette.primary.main,
              },
            }}
            open={isOpenRightBarChannels}
            onClose={toggleDrawer(false)}
          >
            <Box
              sx={{ width: 250, margin: '56px 0px 0px 0px' }}
              role='presentation'
              onClick={toggleDrawer(false)}
              onKeyDown={toggleDrawer(false)}
            >
              <ChannelsRightBar />
            </Box>
          </Drawer>
        </React.Fragment>
      </div>
      <ConversationMembers
        activeChannel={activeChannel}
        modalIsShowsMembers={modalIsShowsMembers}
        setModalIsShowsMembers={setModalIsShowsMembers}
        chatNameRef={chatNameRef}
        doneInvite={doneInvite}
        modalAddPeopleIsOpen={modalAddPeopleIsOpen}
        setModalAddPeopleIsOpen={setModalAddPeopleIsOpen}
        isErrorInPopap={isErrorInPopap}
      />
      <AddPeopleToChannel
        chatNameRef={chatNameRef}
        doneInvite={doneInvite}
        modalAddPeopleIsOpen={modalAddPeopleIsOpen}
        setModalAddPeopleIsOpen={setModalAddPeopleIsOpen}
        isErrorInPopap={isErrorInPopap}
      />
    </div>
  );
};
