import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useQuery, useReactiveVar } from '@apollo/client';
import Divider from '@mui/material/Divider';
import { CHANNELS, GET_DIRECT_MESSAGES } from './SetsUserGraphQL/queryes';
import { activeChatId } from '../../GraphQLApp/reactiveVars';
import { Channels } from './Channels/Channels.jsx';
import { DirectMessages } from './DirectMessages/DirectMessages.jsx';
import './user-sets.sass';

export default function SetsUser(props) {
  const {
    isErrorInPopap,
    setIsErrorInPopap,
    isOpenLeftBar,
    setIsOpenLeftBar,
    modalAddPeopleIsOpen,
  } = props;
  const theme = useTheme();
  const { data: allChannels } = useQuery(CHANNELS);
  const { data: listDirectMessages } = useQuery(GET_DIRECT_MESSAGES);
  const activeChannelId = useReactiveVar(activeChatId).activeChannelId;
  const activeDirectMessageId =
    useReactiveVar(activeChatId).activeDirectMessageId;
  const [modalAddChannelIsOpen, setModalAddChannelIsOpen] = useState(false);
  const [modalAddDmIsOpen, setModalAddDmIsOpen] = useState(false);

  useEffect(() => {
    if (!modalAddChannelIsOpen && !modalAddDmIsOpen && !modalAddPeopleIsOpen) {
      setIsErrorInPopap(false);
    }
  }, [modalAddChannelIsOpen, modalAddDmIsOpen, modalAddPeopleIsOpen]);

  useEffect(() => {
    if (activeChannelId || activeDirectMessageId) {
      return;
    }
    if (
      allChannels &&
      Array.isArray(allChannels.userChannels) &&
      allChannels.userChannels[0] &&
      allChannels.userChannels[0].id
    ) {
      activeChatId({ activeChannelId: allChannels.userChannels[0].id });
    } else if (
      listDirectMessages &&
      Array.isArray(listDirectMessages.directMessages) &&
      listDirectMessages.directMessages[0] &&
      listDirectMessages.directMessages[0].id
    ) {
      activeChatId({
        activeDirectMessageId: listDirectMessages.directMessages[0].id,
      });
    }
  }, [allChannels, listDirectMessages, activeChannelId, activeDirectMessageId]);

  return (
    <div
      style={{
        borderRight: 'solid 1px',
        height: '90vh',
        overflowY: 'scroll',
        background: theme.palette.primary.light,
        margin: '0px 15px',
      }}
    >
      <Divider />
      <Channels
        isOpenLeftBar={isOpenLeftBar}
        modalAddChannelIsOpen={modalAddChannelIsOpen}
        setModalAddChannelIsOpen={setModalAddChannelIsOpen}
        isErrorInPopap={isErrorInPopap}
        setIsErrorInPopap={setIsErrorInPopap}
      />
      <DirectMessages
        isOpenLeftBar={isOpenLeftBar}
        setIsOpenLeftBar={setIsOpenLeftBar}
        modalAddDmIsOpen={modalAddDmIsOpen}
        setModalAddDmIsOpen={setModalAddDmIsOpen}
        isErrorInPopap={isErrorInPopap}
        setIsErrorInPopap={setIsErrorInPopap}
      />
    </div>
  );
}
