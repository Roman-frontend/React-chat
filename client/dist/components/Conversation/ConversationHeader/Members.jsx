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
exports.Members = void 0;
const react_1 = __importStar(require("react"));
const client_1 = require("@apollo/client");
const AvatarGroup_1 = __importDefault(require("@mui/material/AvatarGroup"));
const queryes_1 = require("../../../GraphQLApp/queryes");
const queryes_2 = require("../../SetsUser/SetsUserGraphQL/queryes");
const reactiveVars_1 = require("../../../GraphQLApp/reactiveVars");
const StyledBadge_1 = require("../../Helpers/StyledBadge");
function Members(props) {
    const { activeChannel, setModalIsShowsMembers } = props;
    const { data: users } = (0, client_1.useQuery)(queryes_1.GET_USERS);
    const { data: channels } = (0, client_1.useQuery)(queryes_2.CHANNELS);
    const [iconMembers, setIconMembers] = (0, react_1.useState)([]);
    const activeChannelId = (0, client_1.useReactiveVar)(reactiveVars_1.activeChatId).activeChannelId;
    const usersOnline = (0, client_1.useReactiveVar)(reactiveVars_1.reactiveOnlineMembers);
    (0, react_1.useEffect)(() => {
        if (users && Array.isArray(users.users) && activeChannel) {
            createAvatars();
        }
    }, [activeChannelId, users, activeChannel, usersOnline, channels]);
    const createAvatars = () => {
        let avatars = [];
        activeChannel.members.forEach((memberId) => {
            users.users.forEach((user) => {
                if (user.id === memberId && usersOnline) {
                    const variantDot = usersOnline.includes(user.id) ? 'dot' : 'standard';
                    avatars = avatars.concat(<StyledBadge_1.StyledBadgeWraper variant={variantDot} key={user.id} name={user.name}/>);
                }
            });
        });
        const readyIcons = createAvatar(avatars);
        setIconMembers(readyIcons);
    };
    function createAvatar(avatars) {
        return (<AvatarGroup_1.default max={3} style={{ fontSize: 30, cursor: 'pointer', justifyContent: 'flex-end' }} onClick={() => setModalIsShowsMembers(true)}>
        {avatars}
      </AvatarGroup_1.default>);
    }
    return iconMembers !== [] ? iconMembers : null;
}
exports.Members = Members;
