import React, { useRef } from 'react';
import { useSelector } from 'react-redux';

export function Name(props) {
  const { activeChannel } = props;
  const userId = useSelector((state) => state.userData._id);
  const activeDirectMessageId = useSelector(
    (state) => state.activeDirectMessageId
  );
  const listDirectMessages = useSelector((state) => state.listDirectMessages);
  const chatNameRef = useRef('#general');

  let name = activeChannel ? activeChannel.name : 'general';
  if (activeDirectMessageId && listDirectMessages && listDirectMessages[0]) {
    const activeDirectMessage = listDirectMessages.filter((directMessage) => {
      return directMessage._id === activeDirectMessageId;
    })[0];
    name =
      activeDirectMessage.inviter._id === userId
        ? activeDirectMessage.invited.name
        : activeDirectMessage.inviter.name;
  }

  chatNameRef.current = name;

  return <b className='conversation__name'>✩ {name}</b>;
}
