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
exports.CreateListMembers = void 0;
const react_1 = __importStar(require("react"));
const Person_1 = __importDefault(require("@mui/icons-material/Person"));
const Box_1 = __importDefault(require("@mui/material/Box"));
const List_1 = __importDefault(require("@mui/material/List"));
const ListItem_1 = __importDefault(require("@mui/material/ListItem"));
const ListItemText_1 = __importDefault(require("@mui/material/ListItemText"));
const ListItemAvatar_1 = __importDefault(require("@mui/material/ListItemAvatar"));
const ConversationHeaderStyles_1 = require("../../Conversation/ConversationHeader/ConversationHeaderStyles");
const client_1 = require("@apollo/client");
const queryes_1 = require("../../../GraphQLApp/queryes");
const reactiveVars_1 = require("../../../GraphQLApp/reactiveVars");
function CreateListMembers(props) {
    const { activeChannel, search, classes } = props;
    const [members, setMembers] = (0, react_1.useState)(null);
    const { data: allUsers } = (0, client_1.useQuery)(queryes_1.GET_USERS);
    const usersOnline = (0, client_1.useReactiveVar)(reactiveVars_1.reactiveOnlineMembers);
    (0, react_1.useEffect)(() => {
        if (allUsers && Array.isArray(allUsers.users) && activeChannel) {
            createListMembers();
        }
    }, [usersOnline, activeChannel, allUsers, search]);
    const createListMembers = () => {
        const listMembers = getMembersActiveChannel();
        const readyList = (<List_1.default dense>
        {listMembers.map(({ id, email }) => {
                return (<ListItem_1.default key={id} button>
              <ListItemAvatar_1.default>{createAvatar(id)}</ListItemAvatar_1.default>
              <ListItemText_1.default id={id} primary={email}/>
            </ListItem_1.default>);
            })}
      </List_1.default>);
        setMembers(readyList);
    };
    function getMembersActiveChannel() {
        const regExp = new RegExp(`${search}`, 'gi');
        if (activeChannel && allUsers && Array.isArray(allUsers.users)) {
            return allUsers.users.filter((user) => {
                return (activeChannel.members.includes(user.id) && user.email.match(regExp));
            });
        }
        return [];
    }
    function createAvatar(memberId) {
        return (<ConversationHeaderStyles_1.StyledBadge overlap='circular' anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }} variant={usersOnline.includes(memberId) ? 'dot' : 'standard'}>
        <Box_1.default>
          <Person_1.default style={{ fontSize: 30, background: 'cadetblue' }} alt='icon-user'/>
        </Box_1.default>
      </ConversationHeaderStyles_1.StyledBadge>);
    }
    return <>{members}</>;
}
exports.CreateListMembers = CreateListMembers;
