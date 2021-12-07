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
exports.DirectMessages = void 0;
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const client_1 = require("@apollo/client");
const notistack_1 = require("notistack");
const styles_1 = require("@mui/material/styles");
const Button_1 = __importDefault(require("@mui/material/Button"));
const styles_2 = require("@mui/styles");
const List_1 = __importDefault(require("@mui/material/List"));
const ListItem_1 = __importDefault(require("@mui/material/ListItem"));
const ListItemIcon_1 = __importDefault(require("@mui/material/ListItemIcon"));
const ListItemText_1 = __importDefault(require("@mui/material/ListItemText"));
const Collapse_1 = __importDefault(require("@mui/material/Collapse"));
const EmojiPeople_1 = __importDefault(require("@mui/icons-material/EmojiPeople"));
const ExpandLess_1 = __importDefault(require("@mui/icons-material/ExpandLess"));
const ExpandMore_1 = __importDefault(require("@mui/icons-material/ExpandMore"));
const queryes_1 = require("../../../GraphQLApp/queryes");
const queryes_2 = require("../../SetsUser/SetsUserGraphQL/queryes");
const reactiveVars_1 = require("../../../GraphQLApp/reactiveVars");
const AddDirectMessage_jsx_1 = require("../../Modals/AddDirectMessage/AddDirectMessage.jsx");
const DirectMessage_1 = require("./DirectMessage");
const soket_1 = require("../../../WebSocket/soket");
const nanoid_1 = require("nanoid");
const useStyles = (0, styles_2.makeStyles)((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
    },
}));
function DirectMessages(props) {
    var _a;
    const { isOpenLeftBar, isErrorInPopap, setIsErrorInPopap, modalAddDmIsOpen, setModalAddDmIsOpen, dataForBadgeInformNewMsg, setChatsHasNewMsgs, } = props;
    const theme = (0, styles_1.useTheme)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const { data: auth } = (0, client_1.useQuery)(queryes_1.AUTH);
    const classes = useStyles();
    const [open, setOpen] = (0, react_1.useState)(true);
    const { data: dDms } = (0, client_1.useQuery)(queryes_2.GET_DIRECT_MESSAGES);
    const { enqueueSnackbar } = (0, notistack_1.useSnackbar)();
    const userId = (0, client_1.useReactiveVar)(reactiveVars_1.reactiveVarId);
    const [createDirectMessage] = (0, client_1.useMutation)(queryes_2.CREATE_DIRECT_MESSAGE, {
        update(cache, { data: { directMessages } }) {
            cache.modify({
                fields: {
                    directMessages(existingDrMsg) {
                        const newCommentRef = directMessages.create.record.map((newDrMsg) => {
                            return cache.writeFragment({
                                data: newDrMsg,
                                fragment: (0, client_1.gql) `
                    fragment NewDirectMessage on DirectMessage {
                      id
                      members
                    }
                  `,
                            });
                        });
                        return [...existingDrMsg, ...newCommentRef];
                    },
                },
            });
        },
        onError(error) {
            console.log(`Помилка ${error}`);
            enqueueSnackbar('Direct Message created!', { variant: 'error' });
        },
        onCompleted(data) {
            const storage = JSON.parse(sessionStorage.getItem('storageData'));
            const newDrMsgIds = data.directMessages.create.record.map(({ id }) => id);
            const toStorage = JSON.stringify(Object.assign(Object.assign({}, storage), { directMessages: [...storage.directMessages, ...newDrMsgIds] }));
            sessionStorage.setItem('storageData', toStorage);
            (0, reactiveVars_1.reactiveDirectMessages)([...(0, reactiveVars_1.reactiveDirectMessages)(), ...newDrMsgIds]);
            enqueueSnackbar('Direct Message created!', { variant: 'success' });
            const dms = data.directMessages.create.record;
            dms.forEach((dm) => {
                const invitedId = dm.members.find((memberId) => {
                    return memberId !== userId;
                });
                (0, soket_1.wsSend)({ meta: 'addedDm', userId, dmId: dm.id, invitedId });
            });
        },
    });
    function doneInvite(action, invited) {
        if (action === 'done' && invited && invited[0]) {
            createDirectMessage({
                variables: { inviter: auth.id, invited },
            });
            setModalAddDmIsOpen(false);
        }
        else {
            setIsErrorInPopap(true);
        }
    }
    return (<>
      <div>
        <List_1.default component='nav' className={classes.root}>
          {isOpenLeftBar ? (<ListItem_1.default sx={{ paddingLeft: 0 }} key={(0, nanoid_1.nanoid)()} button onClick={() => setOpen(!open)}>
              <ListItemIcon_1.default style={{ justifyContent: 'center' }}>
                <EmojiPeople_1.default color='action'/>
              </ListItemIcon_1.default>
              <ListItemText_1.default style={{ textAlign: 'center' }} primary={t('description.dirrectMessageTitle')}/>
              {open ? <ExpandLess_1.default /> : <ExpandMore_1.default />}
            </ListItem_1.default>) : (<ListItem_1.default style={{ padding: 0, margin: 0, justifyContent: 'center' }} key={(0, nanoid_1.nanoid)()} button onClick={() => setOpen(!open)}>
              <ListItemIcon_1.default style={{ padding: '0', justifyContent: 'center' }}>
                <EmojiPeople_1.default color='action'/>
              </ListItemIcon_1.default>
            </ListItem_1.default>)}
          {((_a = dDms === null || dDms === void 0 ? void 0 : dDms.directMessages) === null || _a === void 0 ? void 0 : _a.length) ? (<Collapse_1.default in={open} timeout='auto' unmountOnExit>
              <List_1.default>
                {dDms.directMessages.map((drMsg) => (<react_1.default.Fragment key={drMsg.id}>
                    <DirectMessage_1.DirectMessage drMsg={drMsg} isOpenLeftBar={isOpenLeftBar} dataForBadgeInformNewMsg={dataForBadgeInformNewMsg} setChatsHasNewMsgs={setChatsHasNewMsgs}/>
                  </react_1.default.Fragment>))}
              </List_1.default>
            </Collapse_1.default>) : null}
        </List_1.default>
      </div>
      <Button_1.default size='small' sx={{
            width: '100%',
            padding: 0,
            '&:hover': { color: theme.palette.leftBarItem.light },
        }} color='warning' onClick={() => setModalAddDmIsOpen(true)}>
        {isOpenLeftBar ? `+ ${t('description.addDm')}` : '+'}
      </Button_1.default>
      <AddDirectMessage_jsx_1.AddDirectMessage done={doneInvite} modalAddDmIsOpen={modalAddDmIsOpen} setModalAddDmIsOpen={setModalAddDmIsOpen} isErrorInPopap={isErrorInPopap}/>
    </>);
}
exports.DirectMessages = DirectMessages;
