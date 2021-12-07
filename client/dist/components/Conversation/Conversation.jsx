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
const styles_1 = require("@mui/material/styles");
const system_1 = require("@mui/system");
const ConversationHeaderChannel_jsx_1 = require("./ConversationHeader/ConversationHeaderChannel.jsx");
const ConversationHeaderDrMsg_jsx_1 = require("./ConversationHeader/ConversationHeaderDrMsg.jsx");
const Messages_jsx_1 = require("./Messages/Messages.jsx");
const InputUpdateMessages_jsx_1 = require("./InputUpdateMessages/InputUpdateMessages.jsx");
const ConversationInputHeader_jsx_1 = require("./ConversationInputHeader/ConversationInputHeader.jsx");
const ConversationActionsMessage_jsx_1 = require("./ConversationActionsMessage/ConversationActionsMessage.jsx");
const error_png_1 = __importDefault(require("../../images/error.png"));
const client_1 = require("@apollo/client");
const queryes_1 = require("../SetsUser/SetsUserGraphQL/queryes");
const reactiveVars_1 = require("../../GraphQLApp/reactiveVars");
function Conversation(props) {
    const { isErrorInPopap, setIsErrorInPopap, modalAddPeopleIsOpen, setModalAddPeopleIsOpen, dataForBadgeInformNewMsg, setChatsHasNewMsgs, } = props;
    const theme = (0, styles_1.useTheme)();
    const { data: dChannels } = (0, client_1.useQuery)(queryes_1.CHANNELS);
    const [popupMessage, setPopupMessage] = (0, react_1.useState)(null);
    const [closeBtnChangeMsg, setCloseBtnChangeMsg] = (0, react_1.useState)(null);
    const [closeBtnReplyMsg, setCloseBtnReplyMsg] = (0, react_1.useState)(null);
    const inputRef = (0, react_1.useRef)();
    const changeMessageRef = (0, react_1.useRef)();
    const activeChannelId = (0, client_1.useReactiveVar)(reactiveVars_1.activeChatId).activeChannelId;
    const activeDirectMessageId = (0, client_1.useReactiveVar)(reactiveVars_1.activeChatId).activeDirectMessageId;
    const userId = (0, client_1.useReactiveVar)(reactiveVars_1.reactiveVarId);
    const [openPopup, setOpenPopup] = (0, react_1.useState)(false);
    const checkPrivate = (0, react_1.useCallback)(() => {
        var _a;
        if (((_a = dChannels === null || dChannels === void 0 ? void 0 : dChannels.userChannels) === null || _a === void 0 ? void 0 : _a.length) && activeChannelId) {
            const activeChannelIsPrivate = dChannels.userChannels.find((channel) => channel !== null &&
                channel.id === activeChannelId &&
                channel.isPrivate);
            return activeChannelIsPrivate
                ? activeChannelIsPrivate.members.includes(userId)
                : true;
        }
        return true;
    }, [dChannels, activeChannelId, userId]);
    const contentMessages = () => {
        const hasNotAccesToChat = checkPrivate();
        if (!hasNotAccesToChat) {
            return <img src={error_png_1.default}/>;
        }
        if (activeChannelId || activeDirectMessageId) {
            return (<Messages_jsx_1.Messages openPopup={openPopup} setOpenPopup={setOpenPopup} popupMessage={popupMessage} setPopupMessage={setPopupMessage} setCloseBtnChangeMsg={setCloseBtnChangeMsg} setCloseBtnReplyMsg={setCloseBtnReplyMsg} inputRef={inputRef} changeMessageRef={changeMessageRef} dataForBadgeInformNewMsg={dataForBadgeInformNewMsg} setChatsHasNewMsgs={setChatsHasNewMsgs}/>);
        }
        return null;
    };
    function inputHeader() {
        if ((closeBtnReplyMsg || closeBtnChangeMsg) && popupMessage) {
            return (<ConversationInputHeader_jsx_1.ConversationInputHeader popupMessage={popupMessage} closeBtnReplyMsg={closeBtnReplyMsg} setCloseBtnReplyMsg={setCloseBtnReplyMsg} setCloseBtnChangeMsg={setCloseBtnChangeMsg} inputRef={inputRef} changeMessageRef={changeMessageRef}/>);
        }
        return null;
    }
    const setHeader = (0, react_1.useCallback)(() => {
        return activeChannelId ? (<ConversationHeaderChannel_jsx_1.ConversationHeaderChannel modalAddPeopleIsOpen={modalAddPeopleIsOpen} setModalAddPeopleIsOpen={setModalAddPeopleIsOpen} isErrorInPopap={isErrorInPopap} setIsErrorInPopap={setIsErrorInPopap}/>) : (<ConversationHeaderDrMsg_jsx_1.ConversationHeaderDrMsg />);
    }, [activeChannelId, activeDirectMessageId, modalAddPeopleIsOpen]);
    return (<system_1.Box>
      {setHeader()}
      <system_1.Box style={{
            overflowY: 'auto',
            flexDirection: 'column-reverse',
            display: 'flex',
            height: closeBtnReplyMsg || closeBtnChangeMsg ? 360 : 385,
        }}>
        {contentMessages()}
      </system_1.Box>
      {inputHeader()}
      <ConversationActionsMessage_jsx_1.ConversationActionsMessage openPopup={openPopup} setOpenPopup={setOpenPopup} setCloseBtnReplyMsg={setCloseBtnReplyMsg} inputRef={inputRef} setCloseBtnChangeMsg={setCloseBtnChangeMsg} changeMessageRef={changeMessageRef} popupMessage={popupMessage}/>
      <system_1.Box style={{ display: openPopup && 'none' }}>
        <InputUpdateMessages_jsx_1.InputUpdateMessages popupMessage={popupMessage} inputRef={inputRef} changeMessageRef={changeMessageRef} closeBtnChangeMsg={closeBtnChangeMsg} setCloseBtnChangeMsg={setCloseBtnChangeMsg} closeBtnReplyMsg={closeBtnReplyMsg} setCloseBtnReplyMsg={setCloseBtnReplyMsg}/>
      </system_1.Box>
    </system_1.Box>);
}
exports.default = Conversation;
