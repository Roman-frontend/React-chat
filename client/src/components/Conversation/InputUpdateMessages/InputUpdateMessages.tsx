import React, { useMemo, memo } from 'react';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { AUTH } from '../../../GraphQLApp/queryes';
import {
  CREATE_MESSAGE,
  CHANGE_MESSAGE,
  GET_MESSAGES,
} from '../ConversationGraphQL/queryes';
import { wsSend } from '../../../WebSocket/soket';
import { activeChatId } from '../../../GraphQLApp/reactiveVars';

interface IMessage {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  replyOn: string;
  chatType: string;
  chatId: string;
}

interface IProps {
  changeMessageRef: null | React.MutableRefObject<IMessage | null>;
  closeBtnChangeMsg: boolean;
  setCloseBtnChangeMsg: React.Dispatch<React.SetStateAction<boolean>>;
  closeBtnReplyMsg: boolean;
  setCloseBtnReplyMsg: React.Dispatch<React.SetStateAction<boolean>>;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  popupMessage: null | IMessage;
}

interface ICacheMessage {
  messages: {
    id: string;
    chatMessages: IMessage[] | [];
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    flexGrow: 1,
    fontSize: '3rem',
    textAlign: 'right',
  },
}));

export const InputUpdateMessages = memo((props: IProps) => {
  const {
    changeMessageRef,
    closeBtnChangeMsg,
    setCloseBtnChangeMsg,
    closeBtnReplyMsg,
    setCloseBtnReplyMsg,
    inputRef,
    popupMessage,
  } = props;
  const classes = useStyles();
  const { data: auth } = useQuery(AUTH);
  const activeChannelId = useReactiveVar(activeChatId).activeChannelId;
  const activeDirectMessageId =
    useReactiveVar(activeChatId).activeDirectMessageId;
  const theme = useTheme();

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

  const [createMessage] = useMutation(CREATE_MESSAGE, {
    update: (cache, { data }) => {
      const cacheMsg: ICacheMessage | null = cache.readQuery({
        query: GET_MESSAGES,
        variables: { chatId, chatType, userId: auth.id },
      });
      if (cacheMsg && data?.message) {
        const chatMessages = cacheMsg?.messages?.chatMessages || [];
        const newMsg = data.message.create;

        cache.writeQuery({
          query: GET_MESSAGES,
          data: {
            messages: {
              ...cacheMsg.messages,
              chatMessages: [...chatMessages, newMsg],
            },
          },
        });
      }
    },
    onCompleted(data) {
      sendMessageToWS(data.message.create);
    },
  });

  const [changeMessage] = useMutation(CHANGE_MESSAGE, {
    update: (cache, { data: { message } }) => {
      const cacheMsg: ICacheMessage | null = cache.readQuery({
        query: GET_MESSAGES,
        variables: { chatId, chatType, userId: auth.id },
      });
      if (cacheMsg && message?.change) {
        const cacheMessages: IMessage[] | [] =
          cacheMsg?.messages?.chatMessages || [];
        const chatMessages = cacheMessages.map((msg) => {
          return msg.id === message.change.id ? message.change : msg;
        });
        cache.writeQuery({
          query: GET_MESSAGES,
          data: { messages: { ...cacheMsg.messages, chatMessages } },
        });
      }
    },
    onError(error) {
      console.log(`Помилка ${error}`);
    },
    onCompleted(data) {
      sendMessageToWS(data.message.change);
    },
  });

  function sendMessageToWS(data: IMessage) {
    wsSend({
      meta: 'sendMessage',
      action: 'change',
      room: data.chatId,
      message: data,
    });
  }

  function inputUpdateMessages(event: React.KeyboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const value = inputRef?.current?.value || '';

    //event.shiftKey - містить значення true - коли користувач нажме деякі з клавіш утримуючи shift
    if (value.trim() !== '' && !event.shiftKey && event.key === 'Enter') {
      if (closeBtnChangeMsg) changeMessageText(value);
      else if (closeBtnReplyMsg) messageInReply(value);
      else newMessage(value);
      if (inputRef?.current?.value) inputRef.current.value = '';
    }
  }

  async function changeMessageText(text: string) {
    const newMsg = { id: popupMessage?.id || '', text, chatType };
    changeMessage({
      variables: { input: newMsg },
      optimisticResponse: { message: { change: { ...popupMessage, text } } },
    });
    if (changeMessageRef?.current) changeMessageRef.current = null;
    setCloseBtnChangeMsg(false);
  }

  const messageInReply = (text: string) => {
    const replyMsg = {
      chatId,
      chatType,
      senderId: auth.id,
      replyOn: popupMessage?.text || '',
      text,
    };
    createMessage({
      variables: replyMsg,
      optimisticResponse: {
        message: {
          create: {
            chatId,
            chatType,
            createdAt: Date.now(),
            id: Date.now(),
            replyOn: popupMessage?.text || '',
            text,
            updatedAt: '',
            senderId: auth.id,
            __typename: 'MessagePayload',
          },
        },
      },
    });
    setCloseBtnReplyMsg(false);
  };

  function newMessage(text: string) {
    const newMsg = { chatId, chatType, senderId: auth.id, text };
    createMessage({
      variables: newMsg,
      optimisticResponse: {
        message: {
          create: {
            chatId,
            chatType,
            createdAt: Date.now(),
            id: Date.now(),
            replyOn: null,
            text,
            updatedAt: '',
            senderId: auth.id,
            __typename: 'MessagePayload',
          },
        },
      },
    });
  }

  return (
    <div className={classes.root} id='mainInput'>
      <Grid container spacing={1}>
        <Grid item xs={1}>
          <BorderColorIcon
            //color='input'
            style={{ fontSize: 40, top: '1rem', textAlign: 'center' }}
          />
        </Grid>
        <Grid item xs={11}>
          <TextField
            //color='input'
            label='Enter text'
            variant='standard'
            inputRef={inputRef}
            autoFocus={true}
            onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) =>
              inputUpdateMessages(event)
            }
            sx={{
              paddingRight: '6vw',
              width: '-webkit-fill-available',
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
});
