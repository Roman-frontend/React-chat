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
exports.AddChannel = void 0;
const react_1 = __importStar(require("react"));
const client_1 = require("@apollo/client");
const notistack_1 = require("notistack");
const styles_1 = require("@mui/styles");
const Checkbox_1 = __importDefault(require("@mui/material/Checkbox"));
const TextField_1 = __importDefault(require("@mui/material/TextField"));
const Dialog_1 = __importDefault(require("@mui/material/Dialog"));
const DialogTitle_1 = __importDefault(require("@mui/material/DialogTitle"));
const DialogContent_1 = __importDefault(require("@mui/material/DialogContent"));
const DialogContentText_1 = __importDefault(require("@mui/material/DialogContentText"));
const styles_2 = require("@mui/material/styles");
const queryes_1 = require("../../../GraphQLApp/queryes");
const queryes_2 = require("../../SetsUser/SetsUserGraphQL/queryes");
const SelectPeople_jsx_1 = require("../SelectPeople/SelectPeople.jsx");
const reactiveVars_1 = require("../../../GraphQLApp/reactiveVars");
const useStyles = (0, styles_1.makeStyles)((theme) => ({
    dialogPaper: {
        minWidth: '520px',
        minHeight: '425px',
        margin: 0,
    },
    input: {
        height: '30px',
        width: '220px',
    },
}));
const helperTextStyles = (0, styles_1.makeStyles)((theme) => ({
    root: {
        margin: 4,
        color: 'red',
    },
}));
const AddChannel = (props) => {
    const { setModalAddChannelIsOpen, modalAddChannelIsOpen, isErrorInPopap, setIsErrorInPopap, } = props;
    const popapClasses = useStyles();
    const helperTestClasses = helperTextStyles();
    const { data: auth } = (0, client_1.useQuery)(queryes_1.AUTH);
    const { data: allUsers } = (0, client_1.useQuery)(queryes_1.GET_USERS);
    const { enqueueSnackbar } = (0, notistack_1.useSnackbar)();
    const [isPrivate, setIsPrivate] = (0, react_1.useState)(false);
    const notInvitedRef = (0, react_1.useRef)();
    const [form, setForm] = (0, react_1.useState)({
        name: '',
        discription: '',
        isPrivate: false,
        members: [],
    });
    const theme = (0, styles_2.useTheme)();
    const [createChannel] = (0, client_1.useMutation)(queryes_2.CREATE_CHANNEL, {
        update(cache, { data: { channel } }) {
            cache.modify({
                fields: {
                    userChannels(existingChannels) {
                        const newChannelRef = cache.writeFragment({
                            data: channel.create,
                            fragment: (0, client_1.gql) `
                fragment NewChannel on Channel {
                  id
                  name
                  admin
                  members
                  isPrivate
                }
              `,
                        });
                        return [...existingChannels, newChannelRef];
                    },
                },
            });
        },
        onCompleted(data) {
            const storage = JSON.parse(sessionStorage.getItem('storageData'));
            const toStorage = JSON.stringify(Object.assign(Object.assign({}, storage), { channels: [...storage.channels, data.channel.create.id] }));
            sessionStorage.setItem('storageData', toStorage);
            (0, reactiveVars_1.reactiveVarChannels)([...(0, reactiveVars_1.reactiveVarChannels)(), data.channel.create.id]);
            enqueueSnackbar('Channel created!', { variant: 'success' });
        },
        onError(error) {
            console.log(`Помилка при створенні каналу ${error}`);
            enqueueSnackbar('Channel isn`t created!', { variant: 'error' });
        },
    });
    (0, react_1.useEffect)(() => {
        if (allUsers && allUsers.users && auth) {
            const peoplesInvite = allUsers.users.filter((people) => people.id !== auth.id);
            notInvitedRef.current = peoplesInvite;
        }
    }, [allUsers]);
    const changeHandler = (event) => {
        setForm(Object.assign(Object.assign({}, form), { [event.target.name]: event.target.value }));
    };
    const doneCreate = (action, invited = []) => {
        if (action === 'done' && form.name.trim() !== '') {
            const listInvited = invited[0] ? invited.concat(auth.id) : [auth.id];
            createChannel({
                variables: Object.assign(Object.assign({}, form), { admin: auth.id, members: listInvited }),
            });
            setIsErrorInPopap(false);
            setModalAddChannelIsOpen(false);
        }
        else {
            setIsErrorInPopap(true);
        }
    };
    const closePopap = () => {
        setIsErrorInPopap(false);
        setModalAddChannelIsOpen(false);
    };
    function changeIsPrivate() {
        setForm((prev) => {
            return Object.assign(Object.assign({}, prev), { isPrivate: !isPrivate });
        });
        setIsPrivate(!isPrivate);
    }
    return (<div>
      <Dialog_1.default open={modalAddChannelIsOpen} onClose={() => setModalAddChannelIsOpen(false)} scroll='body' classes={{ paper: popapClasses.dialogPaper }} sx={{
            '& .MuiDialog-paper': {
                backgroundColor: theme.palette.primary.main,
            },
        }}>
        <DialogTitle_1.default>Create a channel</DialogTitle_1.default>
        <DialogContent_1.default>
          <DialogContentText_1.default color='inherit'>
            Channels are where your team communicates. They’re best when
            organized around a topic — #marketing, for example.
          </DialogContentText_1.default>

          <div className='set-channel-forms' id='add-private-channel'>
            <label className='set-channel-forms__label'>Private</label>
            <Checkbox_1.default color='warning' checked={isPrivate} onClick={changeIsPrivate}/>
          </div>
          <TextField_1.default variant='standard' label='Name' color='secondary' classes={{ root: popapClasses.input }} sx={{ color: 'white' }} name='name' required={true} helperText={isErrorInPopap ? 'required' : ''} FormHelperTextProps={{ classes: helperTestClasses }} value={form.name} onChange={changeHandler}/>

          <TextField_1.default variant='standard' color='secondary' label='Discription' sx={{ display: 'flex', margin: '27px 0px 20px' }} name='discription' value={form.discription.value} onChange={changeHandler}/>
          <SelectPeople_jsx_1.SelectPeople isDialogChanged={true} closePopap={closePopap} notInvitedRef={notInvitedRef.current} isErrorInPopap={isErrorInPopap} done={doneCreate}/>
        </DialogContent_1.default>
      </Dialog_1.default>
    </div>);
};
exports.AddChannel = AddChannel;
