import React, { useEffect } from 'react';
import { useQuery, useReactiveVar } from '@apollo/client';
import { Channels } from './Channels/Channels.jsx';
import { DirectMessages } from './DirectMessages/DirectMessages.jsx';
import { CHANNELS, GET_DIRECT_MESSAGES } from './SetsUserGraphQL/queryes';
import { activeChatId } from '../../GraphQLApp/reactiveVars';
import { colors } from '@material-ui/core';
import './user-sets.sass';

export default function SetsUser(props) {
  const { data: allChannels } = useQuery(CHANNELS);
  const { data: listDirectMessages } = useQuery(GET_DIRECT_MESSAGES);
  const activeChannelId = useReactiveVar(activeChatId).activeChannelId;
  const activeDirectMessageId =
    useReactiveVar(activeChatId).activeDirectMessageId;

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
      className='main-font left-block'
      style={{ background: colors.blue[900] }}
    >
      <Channels />
      <DirectMessages />
    </div>
  );
}
