import React, { useEffect, useMemo, Profiler, memo } from 'react';
import { useQuery, useReactiveVar } from '@apollo/client';
import { wsSingleton } from '../../../WebSocket/soket';
import Message from './Message/Message.jsx';
import MessageActionsPopup from './MessageActionsPopup/MessageActionsPopup.jsx';
import { GET_MESSAGES } from '../ConversationGraphQL/queryes';
import './messages.sass';
import { reactiveVarId, activeChatId } from '../../../GraphQLApp/reactiveVars';
import { Loader } from '../../Helpers/Loader';

export const Messages = memo((props) => {
  const userId = useReactiveVar(reactiveVarId);
  const activeChannelId = useReactiveVar(activeChatId).activeChannelId;
  const activeDirectMessageId =
    useReactiveVar(activeChatId).activeDirectMessageId;
  const chatType = useMemo(() => {
    return activeDirectMessageId
      ? 'DirectMessage'
      : activeChannelId
      ? 'Channel'
      : null;
  }, [activeChannelId, activeDirectMessageId]);

  const chatId = useMemo(() => {
    return activeDirectMessageId || activeChannelId || null;
  }, [activeChannelId, activeDirectMessageId]);

  const {
    loading,
    data: messages,
    client,
  } = useQuery(GET_MESSAGES, {
    variables: { chatId, chatType, userId },
    onCompleted(data) {
      console.log(data);
      if (data && data.messages) {
        renderMessages();
      }
    },
  });

  //Підписуємось на подію що спрацює при отриманні повідомлення
  wsSingleton.clientPromise
    .then((wsClient) => {
      wsClient.onmessage = (response) => {
        const parsedRes = JSON.parse(response.data);
        if (parsedRes && parsedRes.text) {
          const oldMsg = client.readQuery({
            query: GET_MESSAGES,
            variables: { chatId, chatType },
          });
          const chatMessages =
            oldMsg && oldMsg.messages && oldMsg.messages.chatMessages
              ? oldMsg.messages.chatMessages
              : [];
          client.writeQuery({
            query: GET_MESSAGES,
            data: {
              messages: {
                ...oldMsg.messages,
                chatMessages: [...chatMessages, parsedRes],
              },
            },
          });
        }
      };
    })
    .catch((error) => console.log(error));

  //Підписуємось на закриття події
  wsSingleton.onclose = (response) => {
    const disconnectStatus = response.wasClean
      ? 'DISCONNECTED CLEAN'
      : 'DISCONNECTED BROKEN';
    console.log(
      `${disconnectStatus} with code ${response.code} reason ${response.reason}`
    );
  };

  const callback = (id, phase, actualTime, baseTime, startTime, commitTime) => {
    console.log(`${id}'s ${phase} phase:`);
  };

  const renderMessages = () => {
    if (
      messages &&
      messages.messages &&
      Array.isArray(messages.messages.chatMessages)
    ) {
      const reversedMessages = messages.messages.chatMessages
        .slice(0, messages.messages.chatMessages.length)
        .reverse();
      return reversedMessages.map((message) => {
        return (
          <Profiler id='Message' key={message.id} onRender={callback}>
            <Message
              key={message.id}
              message={message}
              setPopupMessage={props.setPopupMessage}
            />
          </Profiler>
        );
      });
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div
      style={{
        overflowY: 'auto',
        flexDirection: 'column-reverse',
        display: 'flex',
        height: '65vh',
      }}
    >
      {renderMessages()}
      <MessageActionsPopup {...props} />
    </div>
  );
});
