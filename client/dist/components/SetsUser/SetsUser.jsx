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
const styles_1 = require("@mui/material/styles");
const Divider_1 = __importDefault(require("@mui/material/Divider"));
const queryes_1 = require("./SetsUserGraphQL/queryes");
const reactiveVars_1 = require("../../GraphQLApp/reactiveVars");
const Channels_jsx_1 = require("./Channels/Channels.jsx");
const DirectMessages_jsx_1 = require("./DirectMessages/DirectMessages.jsx");
const styles = {
    leftBar: {
        borderRight: 'solid 1px',
        height: 500,
        margin: '10px 0px',
        overflowY: 'scroll',
    },
};
function SetsUser(props) {
    const { isErrorInPopap, setIsErrorInPopap, isOpenLeftBar, setIsOpenLeftBar, modalAddPeopleIsOpen, dataForBadgeInformNewMsg, setChatsHasNewMsgs, } = props;
    const theme = (0, styles_1.useTheme)();
    const { data: dChannels } = (0, client_1.useQuery)(queryes_1.CHANNELS);
    const { data: dDms } = (0, client_1.useQuery)(queryes_1.GET_DIRECT_MESSAGES);
    const activeChannelId = (0, client_1.useReactiveVar)(reactiveVars_1.activeChatId).activeChannelId;
    const activeDirectMessageId = (0, client_1.useReactiveVar)(reactiveVars_1.activeChatId).activeDirectMessageId;
    const [modalAddChannelIsOpen, setModalAddChannelIsOpen] = (0, react_1.useState)(false);
    const [modalAddDmIsOpen, setModalAddDmIsOpen] = (0, react_1.useState)(false);
    const prevActiveChatIdRef = (0, react_1.useRef)();
    (0, react_1.useEffect)(() => {
        if (!modalAddChannelIsOpen && !modalAddDmIsOpen && !modalAddPeopleIsOpen) {
            setIsErrorInPopap(false);
        }
    }, [modalAddChannelIsOpen, modalAddDmIsOpen, modalAddPeopleIsOpen]);
    (0, react_1.useEffect)(() => {
        var _a, _b;
        if (!activeChannelId && !activeDirectMessageId) {
            if (((_a = dChannels === null || dChannels === void 0 ? void 0 : dChannels.userChannels) === null || _a === void 0 ? void 0 : _a.length) &&
                dChannels.userChannels[0].id &&
                (dChannels.userChannels[0].id !== prevActiveChatIdRef.current ||
                    (dChannels.userChannels[1] && dChannels.userChannels[1].id))) {
                if (dChannels.userChannels[0].id !== prevActiveChatIdRef.current) {
                    (0, reactiveVars_1.activeChatId)({
                        activeChannelId: dChannels.userChannels[0].id,
                    });
                }
                else {
                    (0, reactiveVars_1.activeChatId)({
                        activeChannelId: dChannels.userChannels[1].id,
                    });
                }
            }
            else if (((_b = dDms === null || dDms === void 0 ? void 0 : dDms.directMessages) === null || _b === void 0 ? void 0 : _b.length) &&
                dDms.directMessages[0].id &&
                (dDms.directMessages[0].id !== prevActiveChatIdRef.current ||
                    (dDms.directMessages[1] && dDms.directMessages[1].id))) {
                if (dDms.directMessages[0].id !== prevActiveChatIdRef.current) {
                    (0, reactiveVars_1.activeChatId)({
                        activeDirectMessageId: dDms.directMessages[0].id,
                    });
                }
                else {
                    (0, reactiveVars_1.activeChatId)({
                        activeDirectMessageId: dDms.directMessages[1].id,
                    });
                }
            }
        }
        prevActiveChatIdRef.current = (0, reactiveVars_1.activeChatId)().activeChannelId
            ? (0, reactiveVars_1.activeChatId)().activeChannelId
            : (0, reactiveVars_1.activeChatId)().activeDirectMessageId
                ? (0, reactiveVars_1.activeChatId)().activeDirectMessageId
                : null;
    }, [dChannels, dDms, activeChannelId, activeDirectMessageId]);
    return (<div style={styles.leftBar}>
      <Divider_1.default />
      <Channels_jsx_1.Channels isOpenLeftBar={isOpenLeftBar} modalAddChannelIsOpen={modalAddChannelIsOpen} setModalAddChannelIsOpen={setModalAddChannelIsOpen} isErrorInPopap={isErrorInPopap} setIsErrorInPopap={setIsErrorInPopap}/>
      <DirectMessages_jsx_1.DirectMessages isOpenLeftBar={isOpenLeftBar} setIsOpenLeftBar={setIsOpenLeftBar} modalAddDmIsOpen={modalAddDmIsOpen} setModalAddDmIsOpen={setModalAddDmIsOpen} isErrorInPopap={isErrorInPopap} setIsErrorInPopap={setIsErrorInPopap} dataForBadgeInformNewMsg={dataForBadgeInformNewMsg} setChatsHasNewMsgs={setChatsHasNewMsgs}/>
    </div>);
}
exports.default = SetsUser;
