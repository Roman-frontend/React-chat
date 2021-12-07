"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationInputHeader = void 0;
const react_1 = __importDefault(require("react"));
const client_1 = require("@apollo/client");
const styles_1 = require("@mui/material/styles");
const system_1 = require("@mui/system");
const material_1 = require("@mui/material");
const EndActionButton_jsx_1 = __importDefault(require("../EndActionButton/EndActionButton.jsx"));
const queryes_1 = require("../../../GraphQLApp/queryes");
const ConversationInputHeader = (props) => {
    const { popupMessage, closeBtnReplyMsg, setCloseBtnReplyMsg, setCloseBtnChangeMsg, inputRef, changeMessageRef, } = props;
    const theme = (0, styles_1.useTheme)();
    const { data: users } = (0, client_1.useQuery)(queryes_1.GET_USERS);
    function setName() {
        if (closeBtnReplyMsg) {
            return users.users.find((user) => {
                return user.id === popupMessage.senderId;
            }).name;
        }
        return 'Edit';
    }
    function setText() {
        if (popupMessage.text.length > 20) {
            return `${popupMessage.text.slice(0, 20)}...`;
        }
        return popupMessage.text;
    }
    return (<system_1.Box sx={{
            position: 'relative',
            background: theme.palette.primary.main,
            margin: '0px 65px',
            borderLeft: `inset ${theme.palette.primary.contrastText}`,
        }}>
      <material_1.Grid container spacing={1}>
        <material_1.Grid item xs={11} style={{ padding: 0, lineHeight: 1 }}>
          <p style={{
            margin: 0,
            marginLeft: 20,
            color: theme.palette.primary.contrastText,
        }}>
            {setName()}
          </p>
          <p style={{ margin: 0, marginLeft: 20 }}>{setText()}</p>
        </material_1.Grid>
        <material_1.Grid item xs={1} style={{ padding: 0 }}>
          <EndActionButton_jsx_1.default closeBtnReplyMsg={closeBtnReplyMsg} setCloseBtnReplyMsg={setCloseBtnReplyMsg} setCloseBtnChangeMsg={setCloseBtnChangeMsg} inputRef={inputRef} changeMessageRef={changeMessageRef}/>
        </material_1.Grid>
      </material_1.Grid>
    </system_1.Box>);
};
exports.ConversationInputHeader = ConversationInputHeader;
