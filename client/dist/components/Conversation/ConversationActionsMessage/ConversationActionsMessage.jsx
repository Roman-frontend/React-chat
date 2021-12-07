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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationActionsMessage = void 0;
const react_1 = __importStar(require("react"));
const nanoid_1 = require("nanoid");
const client_1 = require("@apollo/client");
const styles_1 = require("@mui/material/styles");
const system_1 = require("@mui/system");
const Button_1 = __importDefault(require("@mui/material/Button"));
const Reply_1 = __importDefault(require("@mui/icons-material/Reply"));
const Edit_1 = __importDefault(require("@mui/icons-material/Edit"));
const Forward_1 = __importDefault(require("@mui/icons-material/Forward"));
const Delete_1 = __importDefault(require("@mui/icons-material/Delete"));
const queryes_1 = require("../ConversationGraphQL/queryes");
const reactiveVars_1 = require("../../../GraphQLApp/reactiveVars");
const stylesButton = { margin: 1 /* border: '1px solid rebeccapurple' */ };
function ConversationActionsMessage(props) {
    const { openPopup, setOpenPopup, setCloseBtnReplyMsg, inputRef, setCloseBtnChangeMsg, changeMessageRef, popupMessage, } = props;
    const theme = (0, styles_1.useTheme)();
    const userId = (0, client_1.useReactiveVar)(reactiveVars_1.reactiveVarId);
    const activeChannelId = (0, client_1.useReactiveVar)(reactiveVars_1.activeChatId).activeChannelId;
    const activeDirectMessageId = (0, client_1.useReactiveVar)(reactiveVars_1.activeChatId).activeDirectMessageId;
    const [focusRootInput, setFocusRootInput] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        setOpenPopup(null);
        setCloseBtnReplyMsg(null);
        setCloseBtnChangeMsg(null);
    }, [activeChannelId, activeDirectMessageId]);
    (0, react_1.useEffect)(() => {
        if (focusRootInput) {
            inputRef.current.focus();
        }
    }, [focusRootInput]);
    const [removeMessage] = (0, client_1.useMutation)(queryes_1.REMOVE_MESSAGE, {
        update: (cache) => {
            cache.modify({
                fields: {
                    messages({ DELETE }) {
                        return DELETE;
                    },
                },
            });
        },
        onError(error) {
            console.log(`Помилка при видаленні повідомлення ${error}`);
        },
    });
    const handleAnswer = () => {
        setOpenPopup(null);
        setCloseBtnReplyMsg(true);
        setFocusRootInput((0, nanoid_1.nanoid)());
        inputRef.current.value = '';
    };
    const handleChange = () => {
        setCloseBtnChangeMsg(true);
        setOpenPopup(null);
        changeMessageRef.current = popupMessage;
        setFocusRootInput((0, nanoid_1.nanoid)());
        inputRef.current.value = popupMessage.text;
    };
    const handleDelete = () => {
        setOpenPopup(null);
        removeMessage({
            variables: { id: popupMessage.id, chatType: popupMessage.chatType },
        });
    };
    const handleCancel = () => {
        setOpenPopup(null);
    };
    return (<system_1.Box sx={{
            background: theme.palette.primary.main,
            maxWidth: 'initial',
        }} style={{ display: !openPopup && 'none' }}>
      <Button_1.default sx={stylesButton} size='small' variant='contained' color='primary' startIcon={<Reply_1.default />} onClick={handleAnswer}>
        ANSWER
      </Button_1.default>
      {popupMessage && popupMessage.senderId === userId && (<Button_1.default sx={stylesButton} size='small' variant='contained' color='primary' startIcon={<Edit_1.default />} onClick={handleChange}>
          EDIT
        </Button_1.default>)}
      <Button_1.default sx={stylesButton} size='small' variant='contained' color='primary' startIcon={<Forward_1.default />} onClick={() => setOpenPopup(null)}>
        FORWARD
      </Button_1.default>
      {popupMessage && popupMessage.senderId === userId && (<Button_1.default sx={stylesButton} size='small' variant='contained' color='error' startIcon={<Delete_1.default />} onClick={handleDelete}>
          DELETE
        </Button_1.default>)}
      <Button_1.default sx={stylesButton} size='small' variant='contained' color='info' onClick={handleCancel}>
        CANCEL
      </Button_1.default>
    </system_1.Box>);
}
exports.ConversationActionsMessage = ConversationActionsMessage;
