'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k];
          },
        });
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.Messages = void 0;
const react_1 = __importStar(require('react'));
const client_1 = require('@apollo/client');
const soket_1 = require('../../../WebSocket/soket');
const Message_jsx_1 = __importDefault(require('./Message/Message'));
const queryes_1 = require('../ConversationGraphQL/queryes');
const queryes_2 = require('../../SetsUser/SetsUserGraphQL/queryes');
const reactiveVars_1 = require('../../../GraphQLApp/reactiveVars');
const Loader_1 = require('../../Helpers/Loader');
exports.Messages = (0, react_1.memo)((props) => {
  const {
    openPopup,
    setOpenPopup,
    dataForBadgeInformNewMsg,
    setChatsHasNewMsgs,
  } = props;
  const userId = (0, client_1.useReactiveVar)(reactiveVars_1.reactiveVarId);
  const activeChannelId = (0, client_1.useReactiveVar)(
    reactiveVars_1.activeChatId
  ).activeChannelId;
  const activeDirectMessageId = (0, client_1.useReactiveVar)(
    reactiveVars_1.activeChatId
  ).activeDirectMessageId;
  const userDmIds = (0, client_1.useReactiveVar)(
    reactiveVars_1.reactiveDirectMessages
  );
  const { refetch } = (0, client_1.useQuery)(queryes_2.GET_DIRECT_MESSAGES);
  const chatType = (0, react_1.useMemo)(() => {
    return activeDirectMessageId
      ? 'DirectMessage'
      : activeChannelId
      ? 'Channel'
      : null;
  }, [activeChannelId, activeDirectMessageId]);
  const chatId = (0, react_1.useMemo)(() => {
    return activeDirectMessageId || activeChannelId || null;
  }, [activeChannelId, activeDirectMessageId]);
  const {
    loading,
    data: messages,
    client,
  } = (0, client_1.useQuery)(queryes_1.GET_MESSAGES, {
    variables: { chatId, chatType, userId },
    onCompleted(data) {
      if (data && data.messages) {
        renderMessages();
      }
    },
    onError(data) {
      console.log('error __', data);
    },
  });
  //Підписуємось на подію що спрацює при отриманні повідомлення
  soket_1.wsSingleton.clientPromise
    .then((wsClient) => {
      wsClient.onmessage = (response) => {
        const parsedRes = JSON.parse(response.data);
        console.log(parsedRes);
        if (parsedRes && parsedRes.text && parsedRes.chatId === chatId) {
          const oldMsg = client.readQuery({
            query: queryes_1.GET_MESSAGES,
            variables: { chatId, chatType, userId },
          });
          console.log(oldMsg, chatId, chatType, userId);
          const chatMessages =
            oldMsg && oldMsg.messages && oldMsg.messages.chatMessages
              ? oldMsg.messages.chatMessages
              : [];
          client.writeQuery({
            query: queryes_1.GET_MESSAGES,
            data: {
              messages: Object.assign(Object.assign({}, oldMsg.messages), {
                chatMessages: [...chatMessages, parsedRes],
              }),
            },
          });
        }
        if (parsedRes && parsedRes.text && parsedRes.chatId !== chatId) {
          let isFirstNewMsgInChat;
          if (dataForBadgeInformNewMsg[0]) {
            isFirstNewMsgInChat = dataForBadgeInformNewMsg.find(
              (chat) => chat.id === parsedRes.chatId
            );
          }
          console.log(isFirstNewMsgInChat);
          const num = isFirstNewMsgInChat ? isFirstNewMsgInChat.num + 1 : 1;
          const newChatHasNewMsgs = { id: parsedRes.chatId, num };
          const filteredChats = dataForBadgeInformNewMsg.filter(
            (chat) => chat.id !== parsedRes.chatId
          );
          setChatsHasNewMsgs((prev) => [...filteredChats, newChatHasNewMsgs]);
        }
        if (
          (parsedRes === null || parsedRes === void 0
            ? void 0
            : parsedRes.message) &&
          parsedRes.message === 'added dm'
        ) {
          const storage = JSON.parse(sessionStorage.getItem('storageData'));
          const toStorage = JSON.stringify(
            Object.assign(Object.assign({}, storage), {
              directMessages: [...storage.directMessages, parsedRes.id],
            })
          );
          sessionStorage.setItem('storageData', toStorage);
          (0, reactiveVars_1.reactiveDirectMessages)([
            ...userDmIds,
            parsedRes.id,
          ]);
          refetch();
        }
        if (
          (parsedRes === null || parsedRes === void 0
            ? void 0
            : parsedRes.message) &&
          parsedRes.message === 'removed dm'
        ) {
          const storage = JSON.parse(sessionStorage.getItem('storageData'));
          const newDrMsgIds = storage.directMessages.filter(
            (dmId) => dmId !== parsedRes.id
          );
          const toStorage = JSON.stringify(
            Object.assign(Object.assign({}, storage), {
              directMessages: newDrMsgIds,
            })
          );
          sessionStorage.setItem('storageData', toStorage);
          (0, reactiveVars_1.reactiveDirectMessages)(newDrMsgIds);
          refetch();
        }
      };
    })
    .catch((error) => console.log(error));
  //Підписуємось на закриття події
  soket_1.wsSingleton.onclose = (response) => {
    const disconnectStatus = response.wasClean
      ? 'DISCONNECTED CLEAN'
      : 'DISCONNECTED BROKEN';
    console.log(
      `${disconnectStatus} with code ${response.code} reason ${response.reason}`
    );
  };
  const callback = (id, phase, actualTime, baseTime, startTime, commitTime) => {
    //console.log(`${id}'s ${phase} phase:`);
  };
  const renderMessages = (0, react_1.useCallback)(() => {
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
          <react_1.Profiler id='Message' key={message.id} onRender={callback}>
            <Message_jsx_1.default
              key={message.id}
              message={message}
              openPopup={openPopup}
              setOpenPopup={setOpenPopup}
              {...props}
            />
          </react_1.Profiler>
        );
      });
    }
    return null;
  }, [messages, openPopup]);
  if (loading) {
    return <Loader_1.Loader />;
  }
  return renderMessages();
});
