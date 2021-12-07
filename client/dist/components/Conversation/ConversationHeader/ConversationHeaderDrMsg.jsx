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
exports.ConversationHeaderDrMsg = void 0;
const react_1 = __importStar(require("react"));
const styles_1 = require("@mui/material/styles");
const Grid_1 = __importDefault(require("@mui/material/Grid"));
const material_1 = require("@mui/material");
const client_1 = require("@apollo/client");
const queryes_1 = require("../../../GraphQLApp/queryes");
const queryes_2 = require("../../SetsUser/SetsUserGraphQL/queryes");
const reactiveVars_1 = require("../../../GraphQLApp/reactiveVars");
const determineActiveChat_1 = require("../../Helpers/determineActiveChat");
const DirectMessageRightBar_1 = __importDefault(require("../../SetsUser/DirectMessages/DirectMessageRightBar"));
const ConversationHeaderDrMsg = (props) => {
    const theme = (0, styles_1.useTheme)();
    const { data: auth } = (0, client_1.useQuery)(queryes_1.AUTH);
    const { data: listDirectMessages } = (0, client_1.useQuery)(queryes_2.GET_DIRECT_MESSAGES);
    const { data: allUsers } = (0, client_1.useQuery)(queryes_1.GET_USERS);
    const activeDirectMessageId = (0, client_1.useReactiveVar)(reactiveVars_1.activeChatId).activeDirectMessageId;
    const [isOpenRightBarDrMsg, setIsOpenRightBarDrMsg] = (0, react_1.useState)(false);
    function createName() {
        var _a, _b;
        if (activeDirectMessageId &&
            ((_a = listDirectMessages === null || listDirectMessages === void 0 ? void 0 : listDirectMessages.directMessages) === null || _a === void 0 ? void 0 : _a.length) &&
            ((_b = allUsers === null || allUsers === void 0 ? void 0 : allUsers.users) === null || _b === void 0 ? void 0 : _b.length)) {
            const activeDirectMessage = listDirectMessages.directMessages.find((directMessage) => {
                return directMessage.id === activeDirectMessageId;
            });
            if (activeDirectMessage && auth && auth.id) {
                const name = (0, determineActiveChat_1.determineActiveChat)(activeDirectMessage, allUsers.users, auth.id);
                return <b className='conversation__name'>✩ {name}</b>;
            }
        }
        return null;
    }
    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')) {
            return null;
        }
        setIsOpenRightBarDrMsg(open);
    };
    return (<div style={{ background: theme.palette.primary.main }}>
      <Grid_1.default container spacing={1} style={{
            alignItems: 'center',
            height: '4.3rem',
            cursor: 'pointer',
            padding: '0vh 2vw',
        }} sx={{
            '&:hover': {
                color: theme.palette.action.active,
                background: theme.palette.action.hover,
            },
        }} justify='space-between' onClick={toggleDrawer(true)}>
        {createName()}
      </Grid_1.default>
      <div>
        <react_1.default.Fragment>
          <material_1.Drawer sx={{
            '& .MuiDrawer-paperAnchorRight': {
                background: theme.palette.primary.main,
            },
        }} anchor='right' open={isOpenRightBarDrMsg} onClose={toggleDrawer(false)}>
            <material_1.Box sx={{
            width: 250,
            margin: '56px 0px 0px 0px',
        }} role='presentation' onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
              <DirectMessageRightBar_1.default />
            </material_1.Box>
          </material_1.Drawer>
        </react_1.default.Fragment>
      </div>
    </div>);
};
exports.ConversationHeaderDrMsg = ConversationHeaderDrMsg;
