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
    dataForBadgeInformNewMsg,
    setChatsHasNewMsgs,
  } = props;
  const theme = useTheme();
  const { data: dChannels } = useQuery(CHANNELS);
  const { data: dDms } = useQuery(GET_DIRECT_MESSAGES);
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
        dChannels?.userChannels?.length &&
        dChannels.userChannels[0].id &&
        (dChannels.userChannels[0].id !== prevActiveChatIdRef.current ||
          (dChannels.userChannels[1] && dChannels.userChannels[1].id))
      ) {
        if (dChannels.userChannels[0].id !== prevActiveChatIdRef.current) {
          activeChatId({
            activeChannelId: dChannels.userChannels[0].id,
          });
        } else {
          activeChatId({
            activeChannelId: dChannels.userChannels[1].id,
          });
        }
      } else if (
        dDms?.directMessages?.length &&
        dDms.directMessages[0].id &&
        (dDms.directMessages[0].id !== prevActiveChatIdRef.current ||
          (dDms.directMessages[1] && dDms.directMessages[1].id))
      ) {
        if (dDms.directMessages[0].id !== prevActiveChatIdRef.current) {
          activeChatId({
            activeDirectMessageId: dDms.directMessages[0].id,
          });
        } else {
          activeChatId({
            activeDirectMessageId: dDms.directMessages[1].id,
          });
        }
      }
    }

    prevActiveChatIdRef.current = activeChatId().activeChannelId
      ? activeChatId().activeChannelId
      : activeChatId().activeDirectMessageId
      ? activeChatId().activeDirectMessageId
      : null;
  }, [dChannels, dDms, activeChannelId, activeDirectMessageId]);

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
        dataForBadgeInformNewMsg={dataForBadgeInformNewMsg}
        setChatsHasNewMsgs={setChatsHasNewMsgs}
      />
    </div>
  );
}
