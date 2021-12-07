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
exports.ConversationHeaderChannel = void 0;
const react_1 = __importStar(require("react"));
const notistack_1 = require("notistack");
const client_1 = require("@apollo/client");
const styles_1 = require("@mui/material/styles");
const Grid_1 = __importDefault(require("@mui/material/Grid"));
const GroupAdd_1 = __importDefault(require("@mui/icons-material/GroupAdd"));
const Drawer_1 = __importDefault(require("@mui/material/Drawer"));
const system_1 = require("@mui/system");
const Members_1 = require("./Members");
const ConversationMembers_1 = require("../../Modals/ConversationHeader/ConversationMembers");
const AddPeopleToChannel_1 = require("../../Modals/AddPeopleToChannel/AddPeopleToChannel");
const queryes_1 = require("../../SetsUser/SetsUserGraphQL/queryes");
const reactiveVars_js_1 = require("../../../GraphQLApp/reactiveVars.js");
const ChannelsRightBar_1 = __importDefault(require("../../SetsUser/Channels/ChannelsRightBar"));
const ConversationHeaderChannel = (props) => {
    const { isErrorInPopap, setIsErrorInPopap, modalAddPeopleIsOpen, setModalAddPeopleIsOpen, } = props;
    const theme = (0, styles_1.useTheme)();
    const { data: dChannels } = (0, client_1.useQuery)(queryes_1.CHANNELS);
    const { enqueueSnackbar } = (0, notistack_1.useSnackbar)();
    const [modalIsShowsMembers, setModalIsShowsMembers] = (0, react_1.useState)(false);
    const [isOpenRightBarChannels, setIsOpenRightBarChannels] = (0, react_1.useState)(false);
    const chatNameRef = (0, react_1.useRef)('#general');
    const activeChannelId = (0, client_1.useReactiveVar)(reactiveVars_js_1.activeChatId).activeChannelId;
    const [addMemberToChannel] = (0, client_1.useMutation)(queryes_1.ADD_MEMBER_CHANNEL, {
        update: (cache, { data: { channel } }) => {
            var _a;
            if ((_a = dChannels === null || dChannels === void 0 ? void 0 : dChannels.userChannels) === null || _a === void 0 ? void 0 : _a.length) {
                const channelsWithChannelHasMember = dChannels.userChannels.map((userChannel) => {
                    if (userChannel && userChannel.id === channel.addMember.id) {
                        return Object.assign(Object.assign({}, userChannel), { members: channel.addMember.members });
                    }
                    return userChannel;
                });
                cache.writeQuery({
                    query: queryes_1.CHANNELS,
                    data: Object.assign(Object.assign({}, dChannels), { userChannels: channelsWithChannelHasMember }),
                });
            }
        },
        onCompleted(data) {
            enqueueSnackbar('User successfully added', { variant: 'success' });
        },
        onError(error) {
            console.log(`Помилка при додаванні учасника ${error}`);
            enqueueSnackbar('User isn`t added', { variant: 'error' });
        },
    });
    const activeChannel = (0, react_1.useMemo)(() => {
        var _a;
        if (activeChannelId && ((_a = dChannels === null || dChannels === void 0 ? void 0 : dChannels.userChannels) === null || _a === void 0 ? void 0 : _a.length)) {
            return dChannels.userChannels.find((channel) => channel !== null && channel.id === activeChannelId);
        }
    }, [activeChannelId, dChannels]);
    (0, react_1.useEffect)(() => {
        if (activeChannel) {
            chatNameRef.current = activeChannel.name;
        }
    }, [activeChannel]);
    function doneInvite(action, invited = []) {
        if (action === 'done' && invited[0]) {
            addMemberToChannel({ variables: { invited, chatId: activeChannelId } });
            setModalAddPeopleIsOpen(false);
        }
        else {
            setIsErrorInPopap(true);
        }
    }
    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')) {
            return null;
        }
        setIsOpenRightBarChannels(open);
    };
    return (<div style={{ background: theme.palette.primary.main }}>
      <Grid_1.default container spacing={1} style={{ alignItems: 'center', height: '4.3rem' }} justify='space-between'>
        <Grid_1.default item xs={7} style={{
            height: 'inherit',
            padding: '0vw 1.5vw',
            margin: '0vw 0.5vw',
            cursor: 'pointer',
        }} sx={{
            '&:hover': {
                color: theme.palette.action.active,
                background: theme.palette.action.hover,
            },
        }} onClick={toggleDrawer(true)}>
          <p className='conversation__name' style={{ fontWeight: 'bold', marginTop: '1.5rem' }}>
            ✩ {activeChannel ? activeChannel.name : ''}
          </p>
        </Grid_1.default>
        <Grid_1.default item xs={1} style={{ textAlign: 'center', margin: '0px 8px' }}>
          <GroupAdd_1.default style={{ fontSize: 50, cursor: 'pointer' }} onClick={() => setModalAddPeopleIsOpen(true)}/>
        </Grid_1.default>
        <Grid_1.default item xs={3} style={{
            alignSelf: 'center',
            flexBasis: 'min-content',
            margin: '0px 8px',
        }}>
          <Members_1.Members activeChannel={activeChannel} setModalIsShowsMembers={setModalIsShowsMembers}/>
        </Grid_1.default>
      </Grid_1.default>
      <div>
        <react_1.default.Fragment>
          <Drawer_1.default anchor='right' sx={{
            '& .MuiDrawer-paperAnchorRight': {
                background: theme.palette.primary.main,
            },
        }} open={isOpenRightBarChannels} onClose={toggleDrawer(false)}>
            <system_1.Box sx={{ width: 250, margin: '56px 0px 0px 0px' }} role='presentation' onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
              <ChannelsRightBar_1.default />
            </system_1.Box>
          </Drawer_1.default>
        </react_1.default.Fragment>
      </div>
      <ConversationMembers_1.ConversationMembers activeChannel={activeChannel} modalIsShowsMembers={modalIsShowsMembers} setModalIsShowsMembers={setModalIsShowsMembers} chatNameRef={chatNameRef} doneInvite={doneInvite} modalAddPeopleIsOpen={modalAddPeopleIsOpen} setModalAddPeopleIsOpen={setModalAddPeopleIsOpen} isErrorInPopap={isErrorInPopap}/>
      <AddPeopleToChannel_1.AddPeopleToChannel chatNameRef={chatNameRef} doneInvite={doneInvite} modalAddPeopleIsOpen={modalAddPeopleIsOpen} setModalAddPeopleIsOpen={setModalAddPeopleIsOpen} isErrorInPopap={isErrorInPopap}/>
    </div>);
};
exports.ConversationHeaderChannel = ConversationHeaderChannel;
