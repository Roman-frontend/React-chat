import React from 'react';
import { useQuery, useReactiveVar } from '@apollo/client';
import { AUTH, GET_USERS } from '../../../GraphQLApp/queryes';
import { GET_DIRECT_MESSAGES } from '../../SetsUser/SetsUserGraphQL/queryes';
import { activeChatId } from '../../../GraphQLApp/reactiveVars';
import { determineActiveChat } from '../../Helpers/determineActiveChat';

export function Name(props) {
  const { activeChannel } = props;
  const { data: auth } = useQuery(AUTH);
  const { data: listDirectMessages } = useQuery(GET_DIRECT_MESSAGES);
  const { data: allUsers } = useQuery(GET_USERS);
  const activeDirectMessageId =
    useReactiveVar(activeChatId).activeDirectMessageId;

  let name = activeChannel ? activeChannel.name : 'general';
  if (
    activeDirectMessageId &&
    listDirectMessages &&
    Array.isArray(listDirectMessages.directMessages) &&
    listDirectMessages.directMessages[0] &&
    allUsers &&
    Array.isArray(allUsers.users) &&
    allUsers.users[0]
  ) {
    const activeDirectMessage = listDirectMessages.directMessages.find(
      (directMessage) => {
        return directMessage.id === activeDirectMessageId;
      }
    );
    if (activeDirectMessage && auth && auth.id) {
      name = determineActiveChat(activeDirectMessage, allUsers.users, auth.id);
    }
  }

  return <b className='conversation__name'>✩ {name}</b>;
}
