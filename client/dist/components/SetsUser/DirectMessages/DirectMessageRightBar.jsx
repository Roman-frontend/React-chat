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
const react_1 = __importStar(require("react"));
const client_1 = require("@apollo/client");
const List_1 = __importDefault(require("@mui/material/List"));
const ListItem_1 = __importDefault(require("@mui/material/ListItem"));
const ListItemIcon_1 = __importDefault(require("@mui/material/ListItemIcon"));
const ListItemText_1 = __importDefault(require("@mui/material/ListItemText"));
const Person_1 = __importDefault(require("@mui/icons-material/Person"));
const Delete_1 = __importDefault(require("@mui/icons-material/Delete"));
const queryes_1 = require("../../../GraphQLApp/queryes");
const soket_1 = require("../../../WebSocket/soket");
const queryes_2 = require("../SetsUserGraphQL/queryes");
const reactiveVars_1 = require("../../../GraphQLApp/reactiveVars");
const determineActiveChat_1 = require("../../Helpers/determineActiveChat");
const notistack_1 = require("notistack");
const DirectMessageRightBar = (props) => {
    const { data: auth } = (0, client_1.useQuery)(queryes_1.AUTH);
    const { data: users } = (0, client_1.useQuery)(queryes_1.GET_USERS);
    const { data: dDm } = (0, client_1.useQuery)(queryes_2.GET_DIRECT_MESSAGES);
    const activeDirectMessageId = (0, client_1.useReactiveVar)(reactiveVars_1.activeChatId).activeDirectMessageId;
    const userId = (0, client_1.useReactiveVar)(reactiveVars_1.reactiveVarId);
    const { enqueueSnackbar } = (0, notistack_1.useSnackbar)();
    const activeDirectMessage = (0, react_1.useMemo)(() => {
        var _a;
        if (activeDirectMessageId && ((_a = dDm === null || dDm === void 0 ? void 0 : dDm.directMessages) === null || _a === void 0 ? void 0 : _a.length)) {
            return dDm.directMessages.find((drMsg) => drMsg !== null && drMsg.id === activeDirectMessageId);
        }
    }, [activeDirectMessageId, dDm]);
    const name = (0, react_1.useMemo)(() => {
        if (activeDirectMessage) {
            return (0, determineActiveChat_1.determineActiveChat)(activeDirectMessage, users.users, auth.id);
        }
        return '#generall';
    }, [activeDirectMessage]);
    const [removeDirectMessage] = (0, client_1.useMutation)(queryes_2.REMOVE_DIRECT_MESSAGE, {
        update: (cache, { data: { directMessages } }) => {
            cache.modify({
                fields: {
                    directMessages(existingDirectMessagesRefs, { readField }) {
                        return existingDirectMessagesRefs.filter((directMessageRef) => directMessages.remove.recordId !==
                            readField('id', directMessageRef));
                    },
                    messages({ DELETE }) {
                        return DELETE;
                    },
                },
            });
        },
        onCompleted(data) {
            const removedDm = data.directMessages.remove.record;
            const removedUserId = removedDm.members.find((id) => id !== userId);
            const storage = JSON.parse(sessionStorage.getItem('storageData'));
            const newDrMsgIds = storage.directMessages.filter((dmId) => dmId !== removedDm.id);
            const toStorage = JSON.stringify(Object.assign(Object.assign({}, storage), { directMessages: newDrMsgIds }));
            enqueueSnackbar('Direct Message is a success removed!', {
                variant: 'success',
            });
            (0, reactiveVars_1.activeChatId)({});
            sessionStorage.setItem('storageData', toStorage);
            (0, reactiveVars_1.reactiveDirectMessages)(newDrMsgIds);
            (0, soket_1.wsSend)({ meta: 'removedDm', userId, dmId: removedDm.id, removedUserId });
        },
        onError(error) {
            console.log(`Помилка при видаленні повідомлення ${error}`);
            enqueueSnackbar('Direct Message isn`t removed!', { variant: 'error' });
        },
    });
    return (<List_1.default>
      <ListItem_1.default button>
        <ListItemIcon_1.default>
          <Person_1.default style={{
            background: 'cadetblue',
            borderRadius: '50%',
            fontSize: 40,
            cursor: 'pointer',
        }}/>
        </ListItemIcon_1.default>
        <ListItemText_1.default primary={name}/>
      </ListItem_1.default>
      <ListItem_1.default button onClick={() => removeDirectMessage({ variables: { id: activeDirectMessageId } })}>
        <ListItemIcon_1.default>
          <Delete_1.default />
        </ListItemIcon_1.default>
        <ListItemText_1.default primary='Remove chat'/>
      </ListItem_1.default>
    </List_1.default>);
};
exports.default = react_1.default.memo(DirectMessageRightBar);
