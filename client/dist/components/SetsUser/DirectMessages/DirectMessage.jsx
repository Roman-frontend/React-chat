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
exports.DirectMessage = void 0;
const react_1 = __importStar(require("react"));
const client_1 = require("@apollo/client");
const styles_1 = require("@mui/material/styles");
const ListItem_1 = __importDefault(require("@mui/material/ListItem"));
const Badge_1 = __importDefault(require("@mui/material/Badge"));
const ListItemText_1 = __importDefault(require("@mui/material/ListItemText"));
const reactiveVars_1 = require("../../../GraphQLApp/reactiveVars");
const queryes_1 = require("../../../GraphQLApp/queryes");
const queryes_2 = require("../../Conversation/ConversationGraphQL/queryes");
const determineActiveChat_1 = require("../../Helpers/determineActiveChat");
const StyledBadge_1 = require("../../Helpers/StyledBadge");
exports.DirectMessage = (0, react_1.memo)((props) => {
    const { drMsg, key, isOpenLeftBar, dataForBadgeInformNewMsg, setChatsHasNewMsgs } = props;
    const [stopLogin, setStopLogin] = (0, react_1.useState)(true);
    const { data: users } = (0, client_1.useQuery)(queryes_1.GET_USERS);
    const usersOnline = (0, client_1.useReactiveVar)(reactiveVars_1.reactiveOnlineMembers);
    const authId = (0, client_1.useReactiveVar)(reactiveVars_1.reactiveVarId);
    const activeDirectMessageId = (0, client_1.useReactiveVar)(reactiveVars_1.activeChatId).activeDirectMessageId;
    const { refetch } = (0, client_1.useQuery)(queryes_2.GET_MESSAGES, {
        skip: stopLogin,
        variables: { chatId: drMsg.id, chatType: 'DirectMessage', userId: authId },
        onError(data) {
            console.log('error of get messages', data);
        },
    });
    const theme = (0, styles_1.useTheme)();
    function drawItem(name) {
        const friendId = drMsg.members[0] === authId ? drMsg.members[1] : drMsg.members[0];
        const friendIsOnline = usersOnline.includes(friendId);
        const variantDot = friendIsOnline ? 'dot' : 'standard';
        const thisDmHasNewMsgs = dataForBadgeInformNewMsg.find((dm) => dm.id === drMsg.id);
        const numNewMsgs = thisDmHasNewMsgs ? thisDmHasNewMsgs.num : 0;
        return (<>
        <StyledBadge_1.StyledBadgeWraper variant={variantDot} name={name}/>
        {isOpenLeftBar && (<Badge_1.default badgeContent={numNewMsgs} color='error'>
            <ListItemText_1.default primary={name} style={{ margin: '0px 4px 0px 15px' }}/>
          </Badge_1.default>)}
      </>);
    }
    function handleClick() {
        (0, reactiveVars_1.activeChatId)({ activeDirectMessageId: drMsg.id });
        if (dataForBadgeInformNewMsg[0]) {
            const thisDmHasNewMsgs = dataForBadgeInformNewMsg.find((dm) => dm.id === drMsg.id);
            if (thisDmHasNewMsgs) {
                setStopLogin(false);
                refetch({
                    chatId: drMsg.id,
                    chatType: 'DirectMessage',
                    userId: authId,
                });
                const filteredChatHasNewMsgs = dataForBadgeInformNewMsg.filter((dm) => dm.id !== drMsg.id);
                setChatsHasNewMsgs(filteredChatHasNewMsgs);
                setStopLogin(true);
            }
        }
    }
    if (typeof drMsg === 'object' &&
        drMsg !== null &&
        users &&
        Array.isArray(users.users)) {
        const name = (0, determineActiveChat_1.determineActiveChat)(drMsg, users.users, authId);
        return (<ListItem_1.default button key={key} sx={{
                '&.Mui-selected': {
                    background: theme.palette.action.active,
                    color: theme.palette.leftBarItem.contrastText,
                    '&:hover': {
                        background: theme.palette.action.active,
                    },
                },
                textAlign: 'center',
            }} onClick={handleClick} selected={activeDirectMessageId === drMsg.id && true}>
        {drawItem(name)}
      </ListItem_1.default>);
    }
    return null;
});
