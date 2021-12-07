"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Channel = void 0;
const react_1 = __importDefault(require("react"));
const client_1 = require("@apollo/client");
const styles_1 = require("@mui/material/styles");
const ListItem_1 = __importDefault(require("@mui/material/ListItem"));
const ListItemText_1 = __importDefault(require("@mui/material/ListItemText"));
const Avatar_1 = __importDefault(require("@mui/material/Avatar"));
const reactiveVars_1 = require("../../../GraphQLApp/reactiveVars");
const Channel = (props) => {
    const { channel, isOpenLeftBar } = props;
    const activeChannelId = (0, client_1.useReactiveVar)(reactiveVars_1.activeChatId).activeChannelId;
    const theme = (0, styles_1.useTheme)();
    if (typeof channel === 'object' && channel !== null) {
        return (<ListItem_1.default button sx={{
                '&.Mui-selected': {
                    background: theme.palette.action.active,
                    color: theme.palette.leftBarItem.contrastText,
                    '&:hover': {
                        background: theme.palette.action.active,
                    },
                },
            }} onClick={() => (0, reactiveVars_1.activeChatId)({ activeChannelId: channel.id })} selected={activeChannelId === channel.id && true}>
        <>
          <Avatar_1.default alt={channel.name} size='small'>
            {channel.name[0]}
          </Avatar_1.default>
          {isOpenLeftBar && (<ListItemText_1.default primary={channel.name} style={{ textAlign: 'center' }}/>)}
        </>
      </ListItem_1.default>);
    }
    return null;
};
exports.Channel = Channel;
