import React, { useRef, useEffect, useState } from 'react';
import { useQuery, useReactiveVar } from '@apollo/client';
import { useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import { CHANNELS, GET_DIRECT_MESSAGES } from './SetsUserGraphQL/queryes';
import { activeChatId } from '../../GraphQLApp/reactiveVars';
import { Channels } from './Channels/Channels.jsx';
import { DirectMessages } from './DirectMessages/DirectMessages.jsx';

const styles = {
  leftBar: {
    borderRight: 'solid 1px',
    height: 500,
    margin: '10px 0px',
    overflowY: 'scroll',
  },
};

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
  const prevActiveChatIdRef = useRef();

  useEffect(() => {
    if (!modalAddChannelIsOpen && !modalAddDmIsOpen && !modalAddPeopleIsOpen) {
      setIsErrorInPopap(false);
    }
  }, [modalAddChannelIsOpen, modalAddDmIsOpen, modalAddPeopleIsOpen]);

  useEffect(() => {
    if (!activeChannelId && !activeDirectMessageId) {
      if (
        allChannels &&
        Array.isArray(allChannels.userChannels) &&
        allChannels.userChannels[0] &&
        allChannels.userChannels[0].id &&
        (allChannels.userChannels[0].id !== prevActiveChatIdRef.current ||
          (allChannels.userChannels[1] && allChannels.userChannels[1].id))
      ) {
        if (allChannels.userChannels[0].id !== prevActiveChatIdRef.current) {
          activeChatId({
            activeChannelId: allChannels.userChannels[0].id,
          });
        } else {
          activeChatId({
            activeChannelId: allChannels.userChannels[1].id,
          });
        }
      } else if (
        listDirectMessages &&
        Array.isArray(listDirectMessages.directMessages) &&
        listDirectMessages.directMessages[0] &&
        listDirectMessages.directMessages[0].id &&
        (listDirectMessages.directMessages[0].id !==
          prevActiveChatIdRef.current ||
          (listDirectMessages.directMessages[1] &&
            listDirectMessages.directMessages[1].id))
      ) {
        if (
          listDirectMessages.directMessages[0].id !==
          prevActiveChatIdRef.current
        ) {
          activeChatId({
            activeDirectMessageId: listDirectMessages.directMessages[0].id,
          });
        } else {
          activeChatId({
            activeDirectMessageId: listDirectMessages.directMessages[1].id,
          });
        }
      }
    }

    prevActiveChatIdRef.current = activeChatId().activeChannelId
      ? activeChatId().activeChannelId
      : activeChatId().activeDirectMessageId
      ? activeChatId().activeDirectMessageId
      : null;
  }, [allChannels, listDirectMessages, activeChannelId, activeDirectMessageId]);

  return (
    <div style={styles.leftBar}>
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
