import React, { useRef } from 'react';
import { useQuery } from '@apollo/client';
import { APP, AUTH, GET_DIRECT_MESSAGES } from '../../GraphQL/queryes';

export function Name(props) {
  const { activeChannel } = props;
  const { data: auth } = useQuery(AUTH);
  const { data: listDirectMessages } = useQuery(GET_DIRECT_MESSAGES);
  const { data: activeChat } = useQuery(APP);
  const chatNameRef = useRef('#general');

  let name = activeChannel ? activeChannel.name : 'general';
  if (
    activeChat &&
    activeChat.activeDirectMessageId &&
    listDirectMessages &&
    listDirectMessages.directMessages &&
    listDirectMessages.directMessages[0]
  ) {
    const activeDirectMessage = listDirectMessages.directMessages.filter(
      (directMessage) => {
        return directMessage.id === activeChat.activeDirectMessageId;
      }
    )[0];
    if (activeDirectMessage && auth && auth.id) {
      name =
        activeDirectMessage.inviter.id === auth.id
          ? activeDirectMessage.invited.name
          : activeDirectMessage.inviter.name;
    }
  }

  chatNameRef.current = name;

  return <b className='conversation__name'>✩ {name}</b>;
}
