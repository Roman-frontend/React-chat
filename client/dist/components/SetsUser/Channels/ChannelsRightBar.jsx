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
const notistack_1 = require("notistack");
const List_1 = __importDefault(require("@mui/material/List"));
const ListItem_1 = __importDefault(require("@mui/material/ListItem"));
const ListItemIcon_1 = __importDefault(require("@mui/material/ListItemIcon"));
const ListItemText_1 = __importDefault(require("@mui/material/ListItemText"));
const Group_1 = __importDefault(require("@mui/icons-material/Group"));
const Delete_1 = __importDefault(require("@mui/icons-material/Delete"));
const queryes_1 = require("../SetsUserGraphQL/queryes");
const reactiveVars_js_1 = require("../../../GraphQLApp/reactiveVars.js");
const ChannelsRightBar = (props) => {
    const { data: dChannels } = (0, client_1.useQuery)(queryes_1.CHANNELS);
    const activeChannelId = (0, client_1.useReactiveVar)(reactiveVars_js_1.activeChatId).activeChannelId;
    const userId = (0, client_1.useReactiveVar)(reactiveVars_js_1.reactiveVarId);
    const { enqueueSnackbar } = (0, notistack_1.useSnackbar)();
    const activeChannel = (0, react_1.useMemo)(() => {
        var _a;
        if (activeChannelId && ((_a = dChannels === null || dChannels === void 0 ? void 0 : dChannels.userChannels) === null || _a === void 0 ? void 0 : _a.length)) {
            return dChannels.userChannels.find((channel) => channel !== null && channel.id === activeChannelId);
        }
    }, [activeChannelId, dChannels]);
    const [removeChannel] = (0, client_1.useMutation)(queryes_1.REMOVE_CHANNEL, {
        update: (cache, { data: { channel } }) => {
            cache.modify({
                fields: {
                    userChannels(existingChannelRefs, { readField }) {
                        return existingChannelRefs.filter((channelRef) => channel.remove.recordId !== readField('id', channelRef));
                    },
                    messages({ DELETE }) {
                        return DELETE;
                    },
                },
            });
        },
        onError(error) {
            console.log(`Помилка при видаленні повідомлення ${error}`);
            enqueueSnackbar('Channel isn`t removed!', { variant: 'error' });
        },
        onCompleted(data) {
            console.log(data);
            enqueueSnackbar('Channel is a success removed!', {
                variant: 'success',
            });
            (0, reactiveVars_js_1.activeChatId)({});
        },
    });
    function remove() {
        let name = 'Leave channel';
        if (activeChannel && activeChannel.admin === userId) {
            name = 'Remove channel';
        }
        return (<ListItem_1.default button>
        <ListItemIcon_1.default>
          <Delete_1.default />
        </ListItemIcon_1.default>
        <ListItemText_1.default primary={name} onClick={() => removeChannel({ variables: { channelId: activeChannelId, userId } })}/>
      </ListItem_1.default>);
    }
    return (<List_1.default>
      <ListItem_1.default button>
        <ListItemIcon_1.default>
          <Group_1.default style={{
            background: 'cadetblue',
            borderRadius: '50%',
        }}/>
        </ListItemIcon_1.default>
        <ListItemText_1.default primary={activeChannel ? activeChannel.name : '#general'}/>
      </ListItem_1.default>
      {remove()}
    </List_1.default>);
};
exports.default = react_1.default.memo(ChannelsRightBar);
