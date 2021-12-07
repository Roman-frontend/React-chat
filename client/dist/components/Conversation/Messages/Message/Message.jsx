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
const react_i18next_1 = require("react-i18next");
const client_1 = require("@apollo/client");
const prop_types_1 = __importDefault(require("prop-types"));
const styles_1 = require("@mui/material/styles");
const Box_1 = __importDefault(require("@mui/material/Box"));
const User_Icon_png_1 = __importDefault(require("../../../../images/User-Icon.png"));
const DateCreators_1 = require("../../../Helpers/DateCreators");
const queryes_1 = require("../../../../GraphQLApp/queryes");
const Loader_1 = require("../../../Helpers/Loader");
require("./message.sass");
const Message = (0, react_1.memo)(({ message, openPopup, setOpenPopup, setPopupMessage, setCloseBtnChangeMsg, setCloseBtnReplyMsg, }) => {
    const { text, createdAt, updatedAt, id, senderId, replyOn } = message;
    const { t } = (0, react_i18next_1.useTranslation)();
    const theme = (0, styles_1.useTheme)();
    const { data: users, loading } = (0, client_1.useQuery)(queryes_1.GET_USERS);
    const senderName = (0, react_1.useMemo)(() => {
        console.log(users, senderId);
        return users.users.find((user) => {
            return user.id === senderId;
        }).name;
    }, [users]);
    const classMessage = replyOn ? 'container-reply' : 'container';
    const replyMessage = replyOn ? (<div className={`${classMessage}__reply`}>
        <p style={{
            fontWeight: 600,
            color: theme.palette.primary.contrastText,
            margin: '15px 0px 20px 0px',
        }}>
          {senderName}
        </p>
        <p style={{ margin: '0px 0px 10px 0px' }}>{replyOn}</p>
      </div>) : null;
    const handleClick = () => {
        setOpenPopup((prev) => {
            return prev === id ? null : id;
        });
        setCloseBtnChangeMsg(null);
        setCloseBtnReplyMsg(null);
        setPopupMessage(message);
    };
    if (loading)
        return <Loader_1.Loader />;
    return (<Box_1.default sx={{
            cursor: 'pointer',
            position: 'relative',
            '&:hover': {
                backgroundColor: openPopup !== id && theme.palette.primary.main,
            },
            backgroundColor: openPopup === id && theme.palette.primary.dark,
        }}>
        <Box_1.default className={classMessage} id={id} onClick={handleClick}>
          <img src={User_Icon_png_1.default} className={`${classMessage}__icon`} style={{
            borderRadius: 0,
            height: 40,
            width: 40,
        }}/>
          <p style={{ color: theme.palette.primary.contrastText }} className={`${classMessage}__messager`}>
            {senderName}
          </p>
          <p className={`${classMessage}__date`}>{(0, DateCreators_1.messageDate)(createdAt)}</p>
          <p style={{
            display: updatedAt && updatedAt !== createdAt ? 'block' : 'none',
            fontSize: 11,
        }} className={`${classMessage}__info`}>
            {`${t('description.editedMessage')}: ${(0, DateCreators_1.messageDate)(updatedAt || createdAt)}`}
          </p>
          <p style={{ maxWidth: 'fit-content' }} className={`${classMessage}__message`}>
            {text}
          </p>
          {replyMessage}
        </Box_1.default>
      </Box_1.default>);
});
Message.propTypes = {
    message: prop_types_1.default.object,
};
exports.default = Message;
