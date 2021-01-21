import React from 'react';
import { useQuery, useReactiveVar } from '@apollo/client';
import { AUTH } from '../../../GraphQLApp/queryes';
import { GET_DIRECT_MESSAGES } from '../../SetsUser/SetsUserGraphQL/queryes';
import { activeChatId } from '../../../GraphQLApp/reactiveVariables';

export function Name(props) {
  const { activeChannel } = props;
  const { data: auth } = useQuery(AUTH);
  const { data: listDirectMessages } = useQuery(GET_DIRECT_MESSAGES);
  const activeDirectMessageId = useReactiveVar(activeChatId)
    .activeDirectMessageId;

  let name = activeChannel ? activeChannel.name : 'general';
  if (
    activeDirectMessageId &&
    listDirectMessages &&
    Array.isArray(listDirectMessages.directMessages) &&
    listDirectMessages.directMessages[0]
  ) {
    const activeDirectMessage = listDirectMessages.directMessages.find(
      (directMessage) => {
        return directMessage.id === activeDirectMessageId;
      }
    );
    if (activeDirectMessage && auth && auth.id) {
      name =
        activeDirectMessage.inviter.id === auth.id
          ? activeDirectMessage.invited.name
          : activeDirectMessage.inviter.name;
    }
  }

  return <b className='conversation__name'>✩ {name}</b>;
}
