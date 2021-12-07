"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputUpdateMessages = void 0;
const react_1 = __importStar(require("react"));
const styles_1 = require("@mui/material/styles");
const styles_2 = require("@mui/styles");
const BorderColor_1 = __importDefault(require("@mui/icons-material/BorderColor"));
const TextField_1 = __importDefault(require("@mui/material/TextField"));
const Grid_1 = __importDefault(require("@mui/material/Grid"));
const client_1 = require("@apollo/client");
const queryes_1 = require("../../../GraphQLApp/queryes");
const queryes_2 = require("../ConversationGraphQL/queryes");
const soket_1 = require("../../../WebSocket/soket");
const reactiveVars_1 = require("../../../GraphQLApp/reactiveVars");
const useStyles = (0, styles_2.makeStyles)((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        flexGrow: 1,
        fontSize: '3rem',
        textAlign: 'right',
    },
}));
exports.InputUpdateMessages = (0, react_1.memo)((props) => {
    const { changeMessageRef, closeBtnChangeMsg, setCloseBtnChangeMsg, closeBtnReplyMsg, setCloseBtnReplyMsg, inputRef, popupMessage, } = props;
    const classes = useStyles();
    const { data: auth } = (0, client_1.useQuery)(queryes_1.AUTH);
    const activeChannelId = (0, client_1.useReactiveVar)(reactiveVars_1.activeChatId).activeChannelId;
    const activeDirectMessageId = (0, client_1.useReactiveVar)(reactiveVars_1.activeChatId).activeDirectMessageId;
    const theme = (0, styles_1.useTheme)();
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
    const [createMessage] = (0, client_1.useMutation)(queryes_2.CREATE_MESSAGE, {
        update: (cache, { data }) => {
            var _a;
            const cacheMsg = cache.readQuery({
                query: queryes_2.GET_MESSAGES,
                variables: { chatId, chatType, userId: auth.id },
            });
            if (cacheMsg && (data === null || data === void 0 ? void 0 : data.message)) {
                const chatMessages = ((_a = cacheMsg === null || cacheMsg === void 0 ? void 0 : cacheMsg.messages) === null || _a === void 0 ? void 0 : _a.chatMessages) || [];
                const newMsg = data.message.create;
                cache.writeQuery({
                    query: queryes_2.GET_MESSAGES,
                    data: {
                        messages: Object.assign(Object.assign({}, cacheMsg.messages), { chatMessages: [...chatMessages, newMsg] }),
                    },
                });
            }
        },
        onCompleted(data) {
            sendMessageToWS(data.message.create);
        },
    });
    const [changeMessage] = (0, client_1.useMutation)(queryes_2.CHANGE_MESSAGE, {
        update: (cache, { data: { message } }) => {
            var _a;
            const cacheMsg = cache.readQuery({
                query: queryes_2.GET_MESSAGES,
                variables: { chatId, chatType, userId: auth.id },
            });
            if (cacheMsg && (message === null || message === void 0 ? void 0 : message.change)) {
                const cacheMessages = ((_a = cacheMsg === null || cacheMsg === void 0 ? void 0 : cacheMsg.messages) === null || _a === void 0 ? void 0 : _a.chatMessages) || [];
                const chatMessages = cacheMessages.map((msg) => {
                    return msg.id === message.change.id ? message.change : msg;
                });
                cache.writeQuery({
                    query: queryes_2.GET_MESSAGES,
                    data: { messages: Object.assign(Object.assign({}, cacheMsg.messages), { chatMessages }) },
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
    function sendMessageToWS(data) {
        (0, soket_1.wsSend)({
            meta: 'sendMessage',
            action: 'change',
            room: data.chatId,
            message: data,
        });
    }
    function inputUpdateMessages(event) {
        event.preventDefault();
        const value = inputRef.current.value;
        //event.shiftKey - містить значення true - коли користувач нажме деякі з клавіш утримуючи shift
        if (value.trim() !== '' && !event.shiftKey && event.key === 'Enter') {
            if (closeBtnChangeMsg)
                changeMessageText(value);
            else if (closeBtnReplyMsg)
                messageInReply(value);
            else
                newMessage(value);
            inputRef.current.value = null;
        }
    }
    function changeMessageText(text) {
        return __awaiter(this, void 0, void 0, function* () {
            const newMsg = { id: popupMessage.id, text, chatType };
            changeMessage({
                variables: { input: newMsg },
                optimisticResponse: { message: { change: Object.assign(Object.assign({}, popupMessage), { text }) } },
            });
            changeMessageRef.current = null;
            setCloseBtnChangeMsg(null);
        });
    }
    const messageInReply = (text) => {
        const replyMsg = {
            chatId,
            chatType,
            senderId: auth.id,
            replyOn: popupMessage.text,
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
                        replyOn: popupMessage.text,
                        text,
                        updatedAt: '',
                        senderId: auth.id,
                        __typename: 'MessagePayload',
                    },
                },
            },
        });
        setCloseBtnReplyMsg(null);
    };
    function newMessage(text) {
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
    return (<div className={classes.root} id='mainInput'>
      <Grid_1.default container spacing={1}>
        <Grid_1.default item xs={1}>
          <BorderColor_1.default color='input' style={{ fontSize: 40, top: '1rem', textAlign: 'bottom' }}/>
        </Grid_1.default>
        <Grid_1.default item xs={11}>
          <TextField_1.default color='input' label='Enter text' variant='standard' inputRef={inputRef} autoFocus={true} onKeyUp={(event) => inputUpdateMessages(event)} sx={{
            paddingRight: '6vw',
            width: '-webkit-fill-available',
        }}/>
        </Grid_1.default>
      </Grid_1.default>
    </div>);
});
