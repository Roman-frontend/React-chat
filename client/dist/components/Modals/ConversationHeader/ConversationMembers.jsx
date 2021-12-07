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
exports.ConversationMembers = void 0;
const react_1 = __importStar(require("react"));
const react_modal_1 = __importDefault(require("react-modal"));
const styles_1 = require("@mui/material/styles");
const Box_1 = __importDefault(require("@mui/material/Box"));
const Button_1 = __importDefault(require("@mui/material/Button"));
const TextField_1 = __importDefault(require("@mui/material/TextField"));
const Dialog_1 = __importDefault(require("@mui/material/Dialog"));
const DialogContent_1 = __importDefault(require("@mui/material/DialogContent"));
const DialogTitle_1 = __importDefault(require("@mui/material/DialogTitle"));
const AddPeopleToChannel_1 = require("../../Modals/AddPeopleToChannel/AddPeopleToChannel");
const CreateListMembers_1 = require("./CreateListMembers");
react_modal_1.default.setAppElement('#root');
const ConversationMembers = (props) => {
    const { activeChannel, modalIsShowsMembers, setModalIsShowsMembers, chatNameRef, doneInvite, modalAddPeopleIsOpen, setModalAddPeopleIsOpen, isErrorInPopap, } = props;
    const theme = (0, styles_1.useTheme)();
    const [search, setSearch] = (0, react_1.useState)('[A-Z]');
    const title = (0, react_1.useMemo)(() => {
        const quantityMembers = activeChannel ? activeChannel.members.length : 1;
        const channelName = activeChannel ? `#${activeChannel.name}` : '#general';
        return (<p style={{ margin: 0 }}>
        {`${quantityMembers} members in ${channelName}`}
      </p>);
    }, [activeChannel]);
    function handleInput(event) {
        setSearch(event.target.value);
    }
    return (<div className='set-channel'>
      <Dialog_1.default sx={{
            position: 'absolute',
            top: '18vh',
            maxHeight: '400px',
            '& .MuiDialog-paper': {
                backgroundColor: theme.palette.primary.main,
            },
        }} open={modalIsShowsMembers} onClose={() => setModalIsShowsMembers(false)} aria-labelledby='form-dialog-title'>
        <Box_1.default style={{ textAlign: 'center' }}>
          <DialogTitle_1.default id='form-dialog-title'>{title}</DialogTitle_1.default>
        </Box_1.default>
        <Box_1.default style={{ textAlign: 'center' }}>
          <Button_1.default color='warning' variant='text' onClick={() => setModalAddPeopleIsOpen(true)}>
            Add people
          </Button_1.default>
        </Box_1.default>
        <Box_1.default>
          <TextField_1.default autoFocus color='secondary' variant='standard' label='Search people' style={{ minWidth: '350px', margin: '0px 25px' }} onChange={(event) => handleInput(event)}/>
        </Box_1.default>
        <DialogContent_1.default>
          <CreateListMembers_1.CreateListMembers activeChannel={activeChannel} search={search}/>
        </DialogContent_1.default>
      </Dialog_1.default>
      <AddPeopleToChannel_1.AddPeopleToChannel chatNameRef={chatNameRef} doneInvite={doneInvite} modalAddPeopleIsOpen={modalAddPeopleIsOpen} setModalAddPeopleIsOpen={setModalAddPeopleIsOpen} isErrorInPopap={isErrorInPopap}/>
    </div>);
};
exports.ConversationMembers = ConversationMembers;
